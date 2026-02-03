// import User from '../../../models/userModel.js';

// const userPurchasedCoursesController = async (req, res) => {
//   try {
//     const userId = req.user.userId;

//     const user = await User.findById(userId)
//       .populate({
//         path: 'purchasedCourses',
//         select: 'title courseThumbnail description durationToComplete',
//       });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     return res.status(200).json({
//       success: true,
//       purchasedCourses: user.purchasedCourses,
//     });
//   } catch (error) {
//     console.error('User Purchased Courses Error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Could not fetch purchased courses',
//     });
//   }
// };

// export default userPurchasedCoursesController;
import User from '../../../models/userModel.js';

const userPurchasedCoursesController = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).populate({
      path: 'purchasedCourses',
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const courses = user.purchasedCourses.map((course) => {
      const courseObj = course.toObject();
      const totalModules = courseObj.modules?.length || 0;

      // ❌ modules hata diye
      const { modules, ...courseWithoutModules } = courseObj;

      return {
        ...courseWithoutModules,
        totalModules,   
        hasPurchased: true,
      };
    });

    return res.status(200).json({
      success: true,
      purchasedCourses: courses,
    });
  } catch (error) {
    console.error('User Purchased Courses Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Could not fetch purchased courses',
    });
  }
};

export default userPurchasedCoursesController;
