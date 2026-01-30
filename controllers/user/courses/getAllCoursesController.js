import Course from '../../../models/courseModel.js';
import User from '../../../models/userModel.js';

export const getAllCoursesController = async (req, res) => {
  try {
    let userId = null;
    let purchasedCourses = [];

    // Handle optional auth: if middleware added req.user, use it
    if (req.user && req.user.userId) {
      userId = req.user.userId;

      const user = await User.findById(userId).select('purchasedCourses');
      if (user) {
        purchasedCourses = user.purchasedCourses.map((id) => id.toString());
      }
    }

    const courses = await Course.find({ isPublic: true }).lean();

    const modifiedCourses = courses.map((course) => {
      const hasPurchased = purchasedCourses.includes(course._id.toString());

      const modules = course.modules.map((module) => {
        const { assetLink, ...rest } = module;
        return hasPurchased ? module : rest;
      });

      return {
        ...course,
        ...(userId && { hasPurchased }),
        modules,
      };
    });

    return res.json(modifiedCourses);
  } catch (error) {
    console.error('Fetching Error Course:', error);
    return res.status(500).json({ message: 'Could Not Fetch Courses' });
  }
};
