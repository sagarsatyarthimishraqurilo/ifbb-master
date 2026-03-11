import Course from "../../../models/courseModel.js";
import User from "../../../models/userModel.js";

export const getAllCoursesController = async (req, res) => {
  try {

    let purchasedCourses = [];

    // if user logged in
    if (req.user && req.user.userId) {

      const user = await User.findById(req.user.userId).select("purchasedCourses");

      if (user && user.purchasedCourses.length > 0) {
        purchasedCourses = user.purchasedCourses;
      }
    }

    // filter courses which are NOT purchased
    const courses = await Course.find({
      isPublic: true,
      _id: { $nin: purchasedCourses }
    }).lean();

    return res.json({
      success: true,
      courses
    });

  } catch (error) {
    console.error("Fetching Error Course:", error);

    return res.status(500).json({
      success: false,
      message: "Could Not Fetch Courses",
    });
  }
};