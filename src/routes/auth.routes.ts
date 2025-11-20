import express from "express";
import { AuthController } from "../controllers/auth.controller";
import { validateDto } from "../middleware/validate.middleware";
import { RegisterDto } from "../dtos/register.dto";
import { LoginDto } from "../dtos/login.dto";
import { authenticateJWT } from "../middleware/authenticate.middleware";

const router = express.Router();
const authController = new AuthController();

// register route
router.post("/register", validateDto(RegisterDto), authController.register);

//login route
router.post("/login", validateDto(LoginDto), authController.login);

// listing all user route
router.get("/users", authenticateJWT, authController.getAllUsers);

// list user by id route
router.get("/users/:id", authenticateJWT, authController.getUserById);

export default router;
