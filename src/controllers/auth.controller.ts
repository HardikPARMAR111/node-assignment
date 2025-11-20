import { Request, Response } from "express";
import { AuthService } from "../services/auth.services";
import { AuthRequest } from "../middleware/authenticate.middleware";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    const result = await authService.register(req.body);
    return res.status(result.success ? 201 : 400).json(result);
  }

  async login(req: Request, res: Response) {
    const result = await authService.login(req.body);
    return res.status(result.success ? 200 : 400).json(result);
  }

  async getAllUsers(req: AuthRequest, res: Response) {
    const loggedInUser = req.user;
    const filters = {
      search: req.query.search as string,
      country: req.query.country as string,
    };

    const result = await authService.getAllUsers(loggedInUser, filters);
    return res.status(result.success ? 200 : 403).json(result);
  }

  async getUserById(req: AuthRequest, res: Response) {
    const loggedInUser = req.user;
    const userId = req.params.id;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const result = await authService.getUserById(loggedInUser, userId);
    let status = 200;
    if (!result.success) {
      status = result.message === "Access denied" ? 403 : 404;
    }
    return res.status(status).json(result);
  }
}
