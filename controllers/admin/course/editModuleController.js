import fs from "fs";
import Course from "../../../models/courseModel.js";
import cloudinary from "../../../utils/cloudinaryConfig.js";

export const editModuleController = async (req, res) => {
  const { courseId, moduleId } = req.params;
  const { title, description } = req.body;
  const file = req.file;

  try {
    // Find course
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Find module inside course
    const module = course.modules.id(moduleId);
    if (!module) return res.status(404).json({ message: "Module not found" });

    // Update title & description
    if (title) module.title = title;
    if (description) module.description = description;

    // 🚀 If user uploaded new file → Upload to Cloudinary
    if (file) {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: "module_data",
        resource_type: module.type === "video" ? "video" : "raw",
        chunk_size: 6 * 1024 * 1024,
        timeout: 180000,
        use_filename: true,
        unique_filename: false,
      });

      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);

      if (!uploadResult.secure_url) {
        return res.status(500).json({ message: "Upload failed" });
      }

      module.assetLink = uploadResult.secure_url; // Replace old file URL
    }

    await course.save();

    return res.status(200).json({
      message: "Module updated successfully",
      module,
    });
  } catch (error) {
    console.error("Edit module error:", error);
    return res.status(500).json({ message: "Internal error", error });
  }
};
