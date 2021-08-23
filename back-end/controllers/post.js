// const mysql = require('mysql');
const connect = require('../dbConnect').connection;
const fs = require("fs");


// MIDDLEWARE GETALLPOSTS pour obtenir tous les messages

    exports.getAllPosts = (req, res, next) => {
        let postsQuery = 'SELECT user.firstName, user.lastName, post.postID, post.userID, post.title, post.dateCreation AS date, post.content FROM user INNER JOIN post ON user.userID = post.userID ORDER BY date DESC'
        connect.query(postsQuery, (error, result, field) => {
            if (error) {
                return res.status(400).json({
                    error
                });
            }
            return res.status(200).json(result);
        });
    };

// FIN MIDDLEWARE

// MIDDLEWARE GETONEPOST pour obtenir un message

exports.getOnePost = (req, res, next) => {
    const postId = req.params.id;
    let onePostQuery = 'SELECT * FROM post WHERE postID = ?'
    connect.query(onePostQuery, [postId], (error, result, field) => {
        if (error) {
            return res.status(400).json({
                error
            });
        }
        return res.status(200).json(result);
    });
};
// FIN MIDDLEWARE

// MIDDLEWARE CREATEPOST pour céer les messages

exports.createPost = (req, res, next) => {
    const userId = req.body.userID;
    const title = req.body.title;
    // const gifUrl = req.body.gifUrl;
    const gifUrl = req.body.gifUrl;
    // const gifUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;    
    const content = req.body.content;

    //console.log(imageUrl);
    // console.log(req.file.filename);
    
    const createPostQuery = `INSERT INTO post VALUES (NULL, ?, ?, ?, NOW(), ?)`
    // connect.query(createPostQuery, [userId, title, gifUrl, content], function (error, result, fields) {
        connect.query(createPostQuery, [userId, title, gifUrl, content], function (error, result, fields) {
        if (error) {
            return res.status(400).json({
                error
            });
        }
        return res.status(201).json({
            message: 'Votre post à été publié !'
        })
    });
};



// exports.createPost = (req, res, next) => {
//     const user = decodeUid(req.headers.authorization);
//     const { title, category } = req.body;
//     const imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

//     // Vérification s'il y a une image dans le body
//     if (req.body.image === "null") {
//         return next(new HttpError("Veuillez choisir une image", 400));
//     }

//     // Requête
//     const string = "INSERT INTO posts (Users_id, Categories_id, title, image_url) VALUES (?, ?, ?, ? )";
//     const inserts = [user.id, category, title, imageUrl];
//     const sql = mysql.format(string, inserts);

//     const createPost = db.query(sql, (error, post) => {
//         if (!error) {
//             res.status(201).json({ message: "Publication sauvegardée" });
//         } else {
//             return next(new HttpError("Erreur de requête, la publication n'a pas été créée", 500));
//         }
//     });
// };









// FIN MIDDLEWARE

// MIDDLEWARE DELETEPOST pour supprimer les messages
exports.deletePost = (req, res, next) => {
    let postID = req.params.id;
    let userID = res.locals.userID;

    let sqlDeletePost;
    let sqlSelectPost;

    sqlSelectPost = "SELECT gifUrl FROM Post WHERE postID = ?";
    connect.query(sqlSelectPost, [postID], function (err, result) {
        if (result > 0) {
            const filename = result[0].gifUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => { // On supprime le fichier image en amont
                sqlDeletePost = "DELETE FROM Post WHERE postID = ?";
                mysql.query(sqlDeletePost, [postID], function (err, result) {
                    if (err) {
                        return res.status(500).json(err.message);
                    }
                    res.status(200).json({ message: "Post supprimé !" });
                });
            });
        } else {
            sqlDeletePost = "DELETE FROM Post WHERE postID = ?";
            connect.query(sqlDeletePost, [postID], function (err, result) {
                if (err) {
                    return res.status(500).json(err.message);
                }
                res.status(200).json({ message: "Post supprimé !" });
            });
        }
        if (err) {
            return res.status(500).json(err.message);
        }

    });
};

// MIDDLEWARE MODIFYONEPOST pour editer un post
exports.modifyOnePost = (req, res, next) => {

    connect.query(`UPDATE post SET title = '${req.body.title}', content = '${req.body.content}' WHERE post.postID = ${req.params.id}`, (error, result, field) => {
        if (error) {
            return res.status(400).json({
                error
            });
        }
        return res.status(200).json(result);
    });
};



// New comment
exports.createComment = (req, res, next) => {
    connect.query(`INSERT INTO comments VALUES (NULL, ${req.body.userID}, ${req.body.postID}, NOW(), '${req.body.content}')`, (error, result, field) => {
        if (error) {
            return res.status(400).json({
                error
            });
        }
        return res.status(200).json(result);
    });
};

// Get all comments
exports.getAllComments = (req, res, next) => {
    connect.query(`SELECT user.userID, user.lastName, user.firstName, comments.commentID,comments.content, comments.userID, comments.date FROM user INNER JOIN comments ON user.userID = comments.userID WHERE comments.postID = ${req.params.id} ORDER BY comments.date DESC`,
        (error, result, field) => {
            if (error) {
                return res.status(400).json({
                    error
                });
            }
            return res.status(200).json(result);
        });
};

//Delete comment
exports.deleteComment = (req, res, next) => {
    connect.query(`DELETE FROM comments WHERE commentID = ${req.params.id}`, (error, result, field) => {
    // let sqlDeleteComment;
    // sqlDeleteComment = "DELETE FROM comments WHERE commentID = ?"
    // connect.query(sqlDeleteComment, [commentID], function(err,result) {        
        if (error) {
            return res.status(400).json({
                error
            });
        }
        return res.status(200).json(result);
    });
}

// FIN MIDDLEWARE

// MIDDLEWARE CREATECOMMENT pour créer des commentaires
// exports.createComment = (req, res, next) => {
//     const postID = req.params.id;
//     const userID = res.locals.userID;
//     const body = req.body.body;

//     let sqlCreateComment;
//     let values;

//     sqlCreateComment = "INSERT INTO post VALUES (NULL, ?, NULL, NULL, ?, ?, NOW())";
//     values = [userID, postID, body];
//     connect.query(sqlCreateComment, values, function (err, result) {
//         if (err) {
//             return res.status(500).json(err.message);
//         }
//         res.status(201).json({ message: "Commentaire crée !" });
//     });
// };
// FIN MIDDLEWARE

// MIDDLEWARE REACTPOST pour créer une réaction sur les messages
// exports.reactPost = (req, res, next) => {
//     const userID = res.locals.userID;
//     const reaction = req.body.reaction;
//     const postID = req.params.id;

//     let sqlReaction;
//     let values;

//     sqlReaction = `INSERT INTO Reaction VALUES (?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE reaction = ?`;
//     values = [userID, postID, reaction, reaction];
//     connect.query(sqlReaction, values, function (err, result) {
//         if (err) {
//             return res.status(500).json(err.message);
//         }
//         res.status(201).json({ message: "Reaction créee !" });
//     });
// };