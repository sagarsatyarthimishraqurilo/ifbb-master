import Course from "../../../models/courseModel.js";

export const addModuleController = async (req, res) => {

  const { courseId } = req.params;
  const { title, description, type } = req.body;
  const file = req.file;

  console.log("BODY:", req.body);
  console.log("FILE:", req.file);

  if (!file || !title || !description || !type) {
    return res.status(400).json({
      message: "All module fields and file are required"
    });
  }

  if (!["video", "pdf"].includes(type)) {
    return res.status(400).json({
      message: "Invalid module type"
    });
  }

  try {

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course Not Found"
      });
    }

    // Create public URL for uploaded file
    const fileUrl =
      `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;

    const newModule = {
      title,
      description,
      type,
      assetLink: fileUrl,
    };

    // Add module
    course.modules.push(newModule);

    await course.save();

    const addedModule = course.modules[course.modules.length - 1];

    return res.status(201).json({
      message: "Module added successfully",
      module: addedModule,
    });

  } catch (error) {

    console.error("Add module error:", error);

    return res.status(500).json({
      message: "Internal error",
      error,
    });

  }
};