import User from '../../../models/userModel.js';
const getAllUsersController = async (req, res) => {
  try {
    const users = await User.find({});
    return res.json(users);
  } catch (error) {
    console.error('Admin fetching Users Error', error);
    return res.status(500).json({ message: 'Could Not Fetch Users' });
  }
};

export default getAllUsersController;
