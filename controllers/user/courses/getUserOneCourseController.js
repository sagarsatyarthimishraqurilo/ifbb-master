import Course from '../../../models/courseModel.js';
import User from '../../../models/userModel.js';

export const getUserOneCourseController = async (req, res) => {
  try {
    const { courseId } = req.params;

    let hasPurchased = false;

    // ✅ Course fetch
    const course = await Course.findById(courseId).lean();
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // ✅ Optional user check
    if (req.user?.userId) {
      const user = await User.findById(req.user.userId).select('purchasedCourses');

      hasPurchased = user?.purchasedCourses.some(
        (id) => id.toString() === courseId
      );
    }

    // ✅ Secure modules (hide assetLink if not purchased)
    course.modules = (course.modules || []).map((module) => {
      if (hasPurchased) return module;

      const { assetLink, ...safeModule } = module;
      return safeModule;
    });

    return res.status(200).json({
      success: true,
      ...course,
      ...(req.user?.userId && { hasPurchased }),
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
