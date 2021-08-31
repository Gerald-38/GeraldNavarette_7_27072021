// MODULES - Routeur Express
const express = require("express");
const router = express.Router();
// FIN MODULES

// IMPORTATION USER CONTROLLERS - Importe le controller
const userCtrl = require("../controllers/user");
// FIN IMPORTATION

// IMPORTATION MIDDLEWARES
const auth = require("../middleware/auth"); // Crée un token d'identification
// const multer = require("../middleware/multer-config"); // Permet d'envoyer un fichier dans la requête
const validation = require ("../middleware/verifyPassword")
// FIN IMPORTATION

// ROUTE
router.post("/signup", validation, userCtrl.signup);
router.post("/login", userCtrl.login);
router.delete("/:id/delete", auth, userCtrl.delete); 
router.get("/:id/profile", auth, userCtrl.profile);
// router.get("/:id/role", userCtrl.role);
router.put("/:id/modify", auth, userCtrl.modify);
// ROUTE

module.exports = router;