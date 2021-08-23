// MODULES
const connect = require('../dbConnect').connection; //Connexion à la bd
// const env = require("../environment");  Récupère les variables d'environnement
const bcrypt = require('bcrypt'); // Pour crypter le mot de passe
const jwt = require("jsonwebtoken"); 
const fs = require("fs"); 
require('dotenv').config()
// FIN MODULES

// MIDDLEWARE SIGNUP  - Inscription de l'utilisateur et hashage du mot de passe
exports.signup = (req, res, next) => {

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const email = req.body.email;
            const firstName = req.body.firstName;
            const lastName = req.body.lastName;            
            const password = hash;
            const pseudo = req.body.pseudo;
            const bio = req.body.bio;
            const avatarUrl = req.body.avatarUrl;            

            let sqlSignup;
            let values;

            sqlSignup = "INSERT INTO user VALUES (NULL, ?, ?, ?, ?, ?, NULL, avatarUrl, NOW())";
            values = [email, firstName, lastName, password, pseudo];
            connect.query(sqlSignup, values, function (err, result) {
                if (err) {
                    return res.status(500).json(err.message);
                }
                res.status(201).json({ message: "Utilisateur créé !" });
            });
        })
        .catch(e => res.status(500).json(e));
};
// FIN MIDDLEWARE

//Inscription
// exports.signup = (req, res, next) => {
    //Cryptage Email
    // const buffer = Buffer.from(req.body.email);
    // const cryptedEmail = buffer.toString('base64');
    //Verification email disponible
    // connect.query(`SELECT * FROM user WHERE email='${cryptedEmail}'`,
    //         (err, results, rows) => {
                //Si email deja utilisé
                // if (results.length > 0) {
                //     res.status(401).json({
                //         message: 'Email non disponible.'
                //     });
                //     //Si email disponible
                // } else {
                //Cryptage du MDP
                // bcrypt.hash(req.body.password, 10)
                // .then(cryptedPassword => {
                    //Ajout à la BDD
//                     connect.query(`INSERT INTO user VALUES (NULL, '${cryptedEmail}',  '${req.body.firstName}', '${req.body.lastName}', '${cryptedPassword}', '${req.body.pseudo}', '', '', NOW())`,
//                         (err, results, fields) => {
//                             if (err) {
//                                 console.log(err);
//                                 return res.status(400).json("erreur");
//                             }
//                             return res.status(201).json({
//                                 message: 'Votre compte a bien été crée !'
//                             });
//                         }
//                     );
//                 })
//                 .catch(error => res.status(500).json({
//                     error
//                 }));
//             }
//             });
// };

// MIDDLEWARE LOGIN avec vérification de l'email unique
exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const sqlFindUser = "SELECT userID, password FROM User WHERE email = ?";
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
                    token: jwt.sign(
                        { userID: result[0].userID },
                        process.env.DB_TOKEN, // TODO : A placer dans .env
                        { expiresIn: "24h" }
                    )
                });
            })
            .catch(e => res.status(500).json(e));
    });
};
// FIN MIDDLEWARE

// MIDDLEWARE DELETE pour supprimer un utilisateur
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
// FIN MIDDLEWARE

// MIDDLEWARE PROFILE
exports.profile = (req, res, next) => {
    const userID = res.locals.userID;

    let sqlGetUser = `SELECT email, firstName, lastName, pseudo, bio, avatarUrl, DATE_FORMAT(dateCreation, 'Inscrit depuis le %e %M %Y à %kh%i') AS dateCreation
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
// FIN MIDDLEWARE

// MIDDLEWARE MODIFY
exports.modify = (req, res, next) => {
    const userID = res.locals.userID;
    const email = req.body.email;
    const pseudo = req.body.pseudo;
    const bio = req.body.bio;
    const password = req.body.password;

    let sqlFindUser;
    let sqlModifyUser;
    let sqlChangePassword;
    let values;

    if (req.file) { // Si le changement concerne l'avatar on update directement
        const avatarUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

        sqlFindUser = "SELECT avatarUrl FROM User WHERE userID = ?";
        connect.query(sqlFindUser, [userID], function (err, result) {
            if (err) {
                return res.status(500).json(err.message);
            }

            const filename = result[0].avatarUrl.split("/images/")[1];
            sqlModifyUser = "UPDATE User SET avatarUrl = ? WHERE userID = ?";
            if (filename !== "avatarDefault.jpg") {
                fs.unlink(`images/${filename}`, () => { // On supprime le fichier image en amont
                    connect.query(sqlModifyUser, [avatarUrl, userID], function (err, result) {
                        if (err) {
                            return res.status(500).json(err.message);
                        }
                        return res.status(200).json({ message: "Utilisateur modifé !" });
                    });
                });
            } else {
                connect.query(sqlModifyUser, [avatarUrl, userID], function (err, result) {
                    if (err) {
                        return res.status(500).json(err.message);
                    }
                    return res.status(200).json({ message: "Utilisateur modifé !" });
                });
            }
        });

    } else { // Si le changement concerne les infos de l'user on demande le mdp
        sqlFindUser = "SELECT password FROM User WHERE userID = ?";
        connect.query(sqlFindUser, [userID], function (err, result) {
            if (err) {
                return res.status(500).json(err.message);
            }
            if (result.length == 0) {
                return res.status(401).json({ error: "Utilisateur non trouvé !" });
            }

            const newPassword = req.body.newPassword;
            const passwordHashed = result[0].password;
            bcrypt.compare(password, passwordHashed)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: "Mot de passe incorrect !" });
                    }

                    if (newPassword) { // Si un nouveau mdp est défini
                        bcrypt.hash(newPassword, 10)
                            .then(hash => {
                                sqlChangePassword = "UPDATE User SET email=?, pseudo=?, bio=?, password=? WHERE userID = ?";
                                values = [email, pseudo, bio, hash, userID];
                                connect.query(sqlChangePassword, values, function (err, result) {
                                    if (err) {
                                        return res.status(500).json(err.message);
                                    }
                                    if (result.affectedRows == 0) {
                                        return res.status(400).json({ message: "Changement échoué !" });
                                    }
                                    res.status(200).json({ message: "Changement réussi !" });
                                });
                            })
                            .catch(e => res.status(500).json(e));

                    } else { // Si le mdp reste le même
                        sqlModifyUser = "UPDATE User SET email=?, pseudo=?, bio=? WHERE userID = ?";
                        values = [email, pseudo, bio, userID];
                        connect.query(sqlModifyUser, values, function (err, result) {
                            if (err) {
                                return res.status(500).json(err.message);
                            }
                            if (result.affectedRows == 0) {
                                return res.status(400).json({ message: "Changement échoué !" });
                            }
                            res.status(200).json({ message: "Changement réussi !" });
                        });
                    }
                })
                .catch(e => res.status(500).json(e));
        });
    }
};

// exports.role = (req, res, next) => {
//     const userID = res.locals.userID;

//     sqlFindUser = "SELECT role FROM User WHERE userID = ?";
//     connect.query(sqlFindUser, [userID], function (err, result) {
//         if (err) {
//             return res.status(500).json(err.message);
//         }
//         if (result.length == 0) {
//             return res.status(401).json({ error: "Utilisateur non trouvé !" });
//         }
//         return res.status(200).json(result);
//     });
// };

// FIN MIDDLEWARE