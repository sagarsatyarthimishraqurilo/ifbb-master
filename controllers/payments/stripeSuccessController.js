import Stripe from "stripe";
import Course from "../../models/courseModel.js";
import Purchase from "../../models/purchaseModel.js";
import CourseProgress from "../../models/CourseProgressModel.js";
import User from "../../models/userModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const stripeSuccessController = async (req, res) => {
    try {
        const { session_id } = req.query;
        const userId = req.user.userId;

        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (!session || session.payment_status !== "paid") {
            return res.status(400).json({ message: "Payment not successful" });
        }

        const courseId = session.metadata.courseId;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // ✅ Save purchase
        await Purchase.create({
            user: userId,
            course: courseId,
            amountPaid: session.amount_total / 100,
            currency: session.currency,
            stripeSessionId: session.id,
            paymentStatus: "paid",
        });


        // after payment verified
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 🔥 THIS WAS MISSING
        if (!user.purchasedCourses.includes(courseId)) {
            user.purchasedCourses.push(courseId);
            await user.save();
        }

        // ✅ Create course progress (IMPORTANT)
        await CourseProgress.create({
            user: userId,
            course: courseId,
            modulesProgress: course.modules.map((m) => ({
                moduleId: m._id,
            })),
            currentUnlockedModuleIndex: 0,
        });

        return res.json({
            success: true,
            message: "Payment successful, course enrolled",
        });
    } catch (error) {
        console.error("Stripe success error:", error);
        return res.status(500).json({ message: "Payment verification failed" });
    }
};

export default stripeSuccessController;
