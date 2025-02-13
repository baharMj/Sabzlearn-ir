const express = require("express");
const controller = require("../../controllers/v1/auth"); 
const router = express.Router(); 

// register - login - getMe

router.post("/register", controller.register );
router.post("/login", controller.login );
router.post("/me", controller.getMe );

module.exports = router ; 
