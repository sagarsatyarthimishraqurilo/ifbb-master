import User from '../../../models/userModel.js';

const userPurchasedCoursesController = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId)
      .select('purchasedCourses')
      .populate('purchasedCourses');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      purchasedCourses: user.purchasedCourses,
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
