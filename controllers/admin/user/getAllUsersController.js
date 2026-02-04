import User from '../../../models/userModel.js';
const getAllUsersController = async (req, res) => {
  try {
    const users = await User.find({}).populate({
      path: 'purchasedCourses',
      select: `
          title 
          description 
          courseThumbnail 
          price 
          discountedPrice 
          durationToComplete 
          ratings 
          isPublic
          createdAt
        `,
    });
    return res.json(users);
  } catch (error) {
    console.error('Admin fetching Users Error', error);
    return res.status(500).json({ message: 'Could Not Fetch Users' });
  }
};

export default getAllUsersController;
