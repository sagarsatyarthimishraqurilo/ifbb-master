import Course from '../../../models/courseModel.js';
import User from '../../../models/userModel.js';
import CourseProgress from '../../../models/CourseProgressModel.js';

/*
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
*/

export const getUserOneCourseController = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).lean();
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // 🔹 Guest user → everything locked
    if (!req.user || !req.user.userId) {
      course.modules = course.modules.map(({ assetLink, ...m }) => ({
        ...m,
        locked: true,
      }));

      return res.json({
        success: true,
        course,
        isLoggedIn: false,
      });
    }

    const userId = req.user.userId;

    const progress = await CourseProgress.findOne({
      user: userId,
      course: courseId,
    });

    // 🔹 Not purchased → everything locked
    if (!progress) {
      course.modules = course.modules.map(({ assetLink, ...m }) => ({
        ...m,
        locked: true,
      }));

      return res.json({
        success: true,
        course,
        hasPurchased: false,
      });
    }

    // 🔹 Purchased → unlock based on progress
    course.modules = course.modules.map((module, index) => {
      // 🔓 unlocked
      if (index <= progress.currentUnlockedModuleIndex) {
        return {
          ...module,
          locked: false,
        };
      }

      // 🔒 locked → REMOVE assetLink
      const { assetLink, ...safeModule } = module;
      return {
        ...safeModule,
        locked: true,
      };
    });

    return res.json({
      success: true,
      course,
      hasPurchased: true,
      unlockedUpto: progress.currentUnlockedModuleIndex,
    });
  } catch (error) {
    console.error('Get one course error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
