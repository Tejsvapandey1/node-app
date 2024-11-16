const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware")

router.route("/login/:id").post(authMiddleware,authController.login)
router.route("/signup").post(authController.signUp);
router.route("/delete/:id").delete(authController.deleteUser);

module.exports= router