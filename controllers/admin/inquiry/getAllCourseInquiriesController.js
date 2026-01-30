import CourseInquiry from "../../../models/courseInquiryModel.js";

const getAllCourseInquiriesController = async (req, res) => {
  try {
    const inquiries = await CourseInquiry.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    console.error("Get inquiries error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch inquiries",
    });
  }
};

export default getAllCourseInquiriesController;
