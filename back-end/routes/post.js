const express = require('express');
const router = express.Router();

// IMPORTATION CONTROLLERS
const postCtrl = require("../controllers/post");


// IMPORTATION MIDDLEWARES 
const auth = require("../middleware/auth"); 
const multer = require("../middleware/multer-config"); 

"use strict";


// ROUTES -
router.get("/", auth, postCtrl.getAllPosts);
router.get("/:id", auth, postCtrl.getOnePost);
router.post("/", auth, multer, postCtrl.createPost);  
router.put('/:id', auth, multer, postCtrl.modifyOnePost);
router.delete("/:id", auth, postCtrl.deletePost); 
router.post("/:id/comment", auth, postCtrl.createComment);
router.get("/:id/comment", auth, postCtrl.getAllComments);
router.delete('/:id/comment/:id', auth, postCtrl.deleteComment);
// FIN


module.exports = router;