import fs from "fs";
import path from "path";
import Course from "../../../models/courseModel.js";

export const deleteModuleController = async (req, res) => {

  const { moduleId } = req.params;

  if (!moduleId) {
    return res.status(400).json({
      message: "No Module Id Provided"
    });
  }

  try {

    // Find course containing the module
    const course = await Course.findOne({ "modules._id": moduleId });

    if (!course) {
      return res.status(404).json({
        message: "Module not found"
      });
    }

    // Get module
    const module = course.modules.id(moduleId);

    if (!module) {
      return res.status(404).json({
        message: "Module not found"
      });
    }

    // Delete file from server
    if (module.assetLink) {

      const fileName =
        module.assetLink.split("/uploads/")[1];

      const filePath = path.join(
        process.cwd(),
        "uploads",
        fileName
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Remove module from course
    course.modules.pull(moduleId);

    await course.save();

    return res.status(200).json({
      message: "Module and file deleted successfully"
    });

  } catch (error) {

    console.error("Cannot delete module", error);

    return res.status(500).json({
      message: "Cannot Delete Module"
    });

  }
};