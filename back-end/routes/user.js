
const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");

const auth = require("../middleware/auth"); 
const validation = require ("../middleware/verifyPassword")


// ROUTES
router.post("/signup", validation, userCtrl.signup);
router.post("/login", userCtrl.login);
router.delete("/:id/delete", auth, userCtrl.delete); 
router.get("/:id/profile", auth, userCtrl.profile);
router.put("/:id/modify", auth, userCtrl.modify);
// 

module.exports = router;