import fs from "fs";
import Course from "../../../models/courseModel.js";
import cloudinary from "../../../utils/cloudinaryConfig.js";

export const addModuleController = async (req, res) => {
  const { courseId } = req.params;
  const { title, description, type } = req.body;
  const file = req.file;

  if (!file || !title || !description || !type) {
    return res.status(400).json({ message: "All module fields and file are required" });
  }

  if (!["video", "pdf"].includes(type)) {
    return res.status(400).json({ message: "Invalid module type" });
  }

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course Not Found" });

    const uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: "module_data",
      resource_type: type === "video" ? "video" : "raw",
      chunk_size: 6 * 1024 * 1024,
      timeout: 180000,
      use_filename: true,
      unique_filename: false,
    });

    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);

    if (!uploadResult?.secure_url) {
      return res.status(500).json({ message: "Upload failed: no URL returned" });
    }

    const newModule = {
      title,
      description,
      type,
      assetLink: uploadResult.secure_url,
    };

    // Push module in array
    course.modules.push(newModule);
    await course.save();

    // Get the module WITH Mongoose-generated _id
    const addedModule = course.modules[course.modules.length - 1];

    return res.status(201).json({
      message: "Module added successfully",
      module: addedModule,
    });

  } catch (error) {
    console.error("Add module error:", error);
    return res.status(500).json({ message: "Internal error", error });
  }
};

