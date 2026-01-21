import express from "express";
import {
  authenticateUser,
  createUserAccount,
  getCurrentUserProfile,
  signoutUser,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import upload from "../utils/multer.js";
import { validateSignup } from "../middleware/validation.middleware.js";
const router = express.Router();

// authenticate routes
router.post("/signup", validateSignup, createUserAccount);
router.post("/signin", authenticateUser);
router.get("/signout", signoutUser);

// profile routes
router.get("/profile", isAuthenticated, getCurrentUserProfile);
router.patch(
  "/update-profile",
  isAuthenticated,
  upload.single("avatar"),
  updateUserProfile,
);

export default router;