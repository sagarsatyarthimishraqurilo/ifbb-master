import Course from '../../../models/courseModel.js';

export const deleteModuleController = async (req, res) => {
  const { moduleId } = req.params;
  if (!moduleId) {
    return res.status(400).json({ message: 'No Module Id Provided' });
  }
  try {
    // Find the course containing the module and remove the module
    const updatedCourse = await Course.findOneAndUpdate(
      { 'modules._id': moduleId },
      { $pull: { modules: { _id: moduleId } } },
      { new: true },
    );
    if (!updatedCourse) {
      return res.status(404).json({ message: 'Module not found' });
    }
    return res.status(200).json({ message: 'Module deleted successfully' });
  } catch (error) {
    console.error('Cannot delete module', error);
    return res.status(500).json({ message: 'Cannot Delete Module' });
  }
};
