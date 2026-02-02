import Admin from "../../../../models/adminModel.js";

const getAdminProfileController = async (req, res) => {
    try {
        const adminId = req.user?.userId;
        if (!adminId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const admin = await Admin.findById(adminId).select("-password");
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        return res.status(200).json({ success: true, admin });
    } catch (error) {
        console.error("Get admin profile error:", error);
        return res.status(500).json({ success: false, message: "Could not fetch profile" });
    }
};

export default getAdminProfileController;
