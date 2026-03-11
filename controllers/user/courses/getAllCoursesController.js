import Course from "../../../models/courseModel.js";
import User from "../../../models/userModel.js";

export const getAllCoursesController = async (req, res) => {
  try {

    const userId = req.user.userId;;

    let query = { isPublic: true };

    // if userId is provided
    if (userId) {

      const user = await User.findById(userId).select("purchasedCourses");

      if (user && user.purchasedCourses.length > 0) {
        query._id = { $nin: user.purchasedCourses };
      }
    }

    const courses = await Course.find(query).lean();

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