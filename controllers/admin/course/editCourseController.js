import cloudinary from "../../../utils/cloudinaryConfig.js";
import Course from "../../../models/courseModel.js";
import fs from "fs";

export const editCourseController = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const { title, description, price, discountedPrice, durationToComplete } = req.body;

    let thumbnailUrl = course.courseThumbnail;

    // Upload new thumbnail (if provided)
    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "course_thumbnails",
        resource_type: "image",
      });

      thumbnailUrl = uploaded.secure_url;
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    }

    // Update fields
    if (title) course.title = title;
    if (description) course.description = description;
    if (price) course.price = price;
    if (discountedPrice) course.discountedPrice = discountedPrice;
    if (durationToComplete) course.durationToComplete = durationToComplete;

    course.courseThumbnail = thumbnailUrl;

    await course.save();

    res.status(200).json({
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating course", error: error.message });
  }
};
