import express from "express";
import adminAuthMiddleware from "../../middleware/adminAuthMiddleware.js";
import getAllCourseInquiriesController from "../../controllers/admin/inquiry/getAllCourseInquiriesController.js";

const router = express.Router();

// 🔐 Admin views all inquiries
router.get(
  "/course-inquiries",
  adminAuthMiddleware,
  getAllCourseInquiriesController
);

export default router;
