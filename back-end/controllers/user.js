const connect = require('../dbConnect').connection; //Connexion à la bd
const bcrypt = require('bcrypt'); // Pour crypter le mot de passe
const jwt = require("jsonwebtoken"); 
const fs = require("fs"); 
require('dotenv').config()



//SIGNUP POUR CREER UN COMPTE UTILISATEUR
exports.signup = (req, res, next) => {    
    connect.query(`SELECT * FROM user WHERE email = "${req.body.email}"`, (err, result, rows) => {              
        // Si email deja utilisé
        if (result.length > 0) {
            res.status(401).json({
                message: 'Email déjà utilisé.'
            });            
        } //Si email disponible
        else {
            // Cryptage du MDP
            bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const email = req.body.email;
                const firstName = req.body.firstName;
                const lastName = req.body.lastName;            
                const password = hash;
                const pseudo = req.body.pseudo;

                let sqlSignup;
                let values;

                sqlSignup = "INSERT INTO user VALUES (NULL, ?, ?, ?, ?, 'pseudo', 0, NULL, avatarUrl, NOW())";
                values = [email, firstName, lastName, password, pseudo];
                connect.query(sqlSignup, values, function (err, result) {
                    if (err) {
                        return res.status(500).json(err.message);
                    }
                    res.status(201).json({ message: "Utilisateur créé !" });
                });
            })
            .catch(e => res.status(500).json(e));
        }
    });
};



// LOGIN POUR CONNECTER UN UTILISATEUR
exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const sqlFindUser = "SELECT userID, password, admin FROM User WHERE email = ?";
// recherche de l'utilisateur dans la base de données
    connect.query(sqlFindUser, [email], function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        }
        if (result.length == 0) {
            return res.status(401).json({ error: "Utilisateur non trouvé !" });
        }
// si l'utilisateur existe, vérification du mot de passe
        bcrypt.compare(password, result[0].password)
            .then(valid => {
// si le mot de passe est incorrect
                if (!valid) {
                    return res.status(401).json({ error: "Mot de passe incorrect !" });
                }
                res.status(200).json({
                        userID: result[0].userID, 
                        firstName: result[0].firstName, 
                        lastName: result[0].lastName,
                        admin: result[0].admin,                                                    
                        token: jwt.sign(
                        { userID: result[0].userID },
                        process.env.DB_TOKEN,
                        { expiresIn: "24h" }
                    )
                });
            })
            .catch(e => res.status(500).json(e));
    });
};
//  

//  DELETE POUR SUPPRIMER UN UTILISATEUR
exports.delete = (req, res, next) => {
    const password = req.body.password;
    const userID = res.locals.userID;

    let sqlFindUser;
    let sqlDeleteUser;

    sqlFindUser = "SELECT password, avatarUrl FROM User WHERE userID = ?";
    connect.query(sqlFindUser, [userID], function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        }
        if (result.length == 0) {
            return res.status(401).json({ error: "Utilisateur non trouvé !" });
        }

        const filename = result[0].avatarUrl.split("/images/")[1];
        if (filename !== "avatarDefault.jpg") {
            fs.unlink(`images/${filename}`, (e) => { // On supprime le fichier image en amont
                if (e) {
                    console.log(e);
                }
            });
        }
        
        });
          

        sqlDeleteUser = "DELETE FROM User WHERE userID = ?";
        connect.query(sqlDeleteUser, [userID], function (err, result) {
            if (err) {
                return res.status(500).json(err.message);
            }
            if (result.affectedRows == 0) {
                return res.status(400).json({ message: "Suppression échouée" });
            }
            res.status(200).json({ message: "Utilisateur supprimé !" });
        });   
};
// 

// PROFILE POUR AFFICHER UN PROFIL UTILISATEUR
exports.profile = (req, res, next) => {
    const userID = res.locals.userID;

    let sqlGetUser = `SELECT email, firstName, lastName, pseudo, admin, bio, avatarUrl, DATE_FORMAT(dateCreation, 'Inscrit depuis le %e %M %Y à %kh%i') AS dateCreation
    FROM user WHERE userID = ?`;
    connect.query(sqlGetUser, [userID], function (err, result) {
        if (err) {
            return res.status(500).json(err.message);
        }
        if (result.length == 0) {
            return res.status(400).json({ message: "Aucun utilisateur ne correspond à votre requête" });
        }
        res.status(200).json(result);
    });
};
//  

// MODIFY POUR MODIFIER DES ELEMENTS DU PROFIL
exports.modify = (req, res, next) => {
    const userID = req.params.id;   
    const email = req.body.email;
    const password = req.body.newPassword;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const pseudo = req.body.pseudo;    
    if (!password) {
        sqlModifyUser = "UPDATE User SET email =?, firstName = ?, lastName = ?, pseudo = '' WHERE userID = ?"; 
        values = [email, firstName, lastName, userID];   
        connect.query(sqlModifyUser, values, function (err, result, field) {
            if (err) {
                return res.status(500).json(err.message);
            }
            if (result.affectedRows == 0) {
                return res.status(400).json({ message: "Modification échouée !" });
            }
            res.status(200).json({ message: "Changement réussi !" });
        });
    } else {
        bcrypt.hash(req.body.newPassword, 10)
        .then(hash => {          
            const newPassword = hash;
            sqlModifyUser = "UPDATE User SET email =?, password = ?, firstName = ?, lastName = ?, pseudo = '' WHERE userID = ?"; 
            values = [email, newPassword, firstName, lastName, userID];   
            connect.query(sqlModifyUser, values, function (err, result, field) {
                if (err) {
                    return res.status(500).json(err.message);
                }
                if (result.affectedRows == 0) {
                    return res.status(400).json({ message: "Modification échouée !" });
                }
                res.status(200).json({ message: "Changement réussi !" });
            });
        })
        .catch(e => res.status(500).json(e));
    }  
}


