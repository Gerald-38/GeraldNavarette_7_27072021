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
    const userID = req.body.userID;
    const title = req.body.title;
    let gifUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;    
    const content = req.body.content;    
    const createPostQuery = `INSERT INTO post VALUES (NULL, ?, ?, ?, NOW(), ?)`    
        connect.query(createPostQuery, [userID, title, gifUrl, content], function (error, result) {
        if (error) {
            return res.status(500).json({
                error
            });
        }
        return res.status(201).json({
            message: 'Votre post à été publié !'
        })
    });
};

// FIN MIDDLEWARE

// MIDDLEWARE DELETEPOST pour supprimer les messages
exports.deletePost = (req, res, next) => {
    let postID = req.params.id;
    let userID = res.locals.userID;     
    // let gifUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;    

    let sqlDeletePost;
    let sqlSelectPost;

    sqlSelectPost = "SELECT gifUrl FROM Post WHERE postID = ?";
    connect.query(sqlSelectPost, [postID], function (err, result) {
        if (result) {
            const filename = result[0].gifUrl.split("/images/")[1];            
            fs.unlink(`images/${filename}`, () => { // On supprime le fichier image en amont
                sqlDeletePost = "DELETE FROM Post WHERE userID = ? AND postID = ?";
                connect.query(sqlDeletePost, [userID, postID], function (err, result) {
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
    let postID = req.params.id;
    let title = req.body.title;
     
    let content = req.body.content;

    // quand es ce que ont envoi la requete json et quand cest la formdata
    if(req.file) {
        let gifUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
        sqlSelectPost = "SELECT gifUrl FROM Post WHERE postID = ?";
        connect.query(sqlSelectPost, [postID], function (err, result) {
            if (result) {
                const filename = result[0].gifUrl.split("/images/")[1];            
                fs.unlink(`images/${filename}`, () => { // On supprime le fichier image en amont
                    let sqlModifyPost = "UPDATE post SET title = ?, gifUrl = ?, content = ? WHERE postID = ?";
                    connect.query(sqlModifyPost, [title, gifUrl, content, postID], function (error, result, field) {
                        if (error) {
                            return res.status(400).json({
                                error
                            });
                        }
                        return res.status(200).json(result);
                    });
                });
            } else {                
                let sqlModifyPost = "UPDATE post SET title = ?, gifUrl = ?, content = ? WHERE postID = ?";
                connect.query(sqlModifyPost, [title, gifUrl, content, postID], function (error, result, field) {
                    if (error) {
                        return res.status(400).json({
                            error
                        });
                    }
                    return res.status(200).json(result);
                });
            }
            if (err) {
                return res.status(500).json(err.message);
            }
    
        });
    } else {
        // Ici ont recoit une requete JSON
        let sqlModifyPost = "UPDATE post SET title = ?, content = ? WHERE postID = ?";
        connect.query(sqlModifyPost, [title, content, postID], function (error, result, field) {
            if (error) {
                return res.status(400).json({
                    error
                });
            }
            return res.status(200).json(result);
        });
    }

   
    
    

//    let sqlModifyPost = "UPDATE post SET title = ?, gifUrl = ?, content = ? WHERE postID = ?";
//     connect.query(sqlModifyPost, [title, gifUrl, content, postID], function (error, result, field) {
//         if (error) {
//             return res.status(400).json({
//                 error
//             });
//         }
//         return res.status(200).json(result);
//     });
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
    connect.query(`SELECT user.userID, user.firstName, user.lastName, comments.commentID,comments.content, comments.userID, comments.date FROM user INNER JOIN comments ON user.userID = comments.userID WHERE comments.postID = ${req.params.id} ORDER BY comments.date DESC`,
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

