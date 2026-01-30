import Course from "../../../models/courseModel.js";
import CourseProgress from "../../../models/CourseProgressModel.js";

const submitTestController = async (req, res) => {
    const { courseId, moduleId } = req.params;
    const { answers } = req.body;
    const userId = req.user.userId;

    const course = await Course.findById(courseId);
    const module = course.modules.id(moduleId);

    const progress = await CourseProgress.findOne({ user: userId, course: courseId });
    const moduleProgress = progress.modulesProgress.find(
        (m) => m.moduleId.toString() === moduleId
    );

    let correct = 0;
    const result = [];

    module.test.questions.forEach((q, index) => {
        const ans = answers.find((a) => a.questionIndex === index);
        const isCorrect = ans?.selectedOptionIndex === q.correctOptionIndex;

        if (isCorrect) correct++;

        result.push({
            questionIndex: index,
            selectedOptionIndex: ans?.selectedOptionIndex,
            isCorrect,
        });
    });

    const percentage = (correct / module.test.questions.length) * 100;

    moduleProgress.answers = result;
    moduleProgress.score = percentage;

    if (percentage >= module.test.passPercentage) {
        moduleProgress.testPassed = true;
        progress.currentUnlockedModuleIndex += 1;
    }

    await progress.save();

    return res.json({
        passed: percentage >= 60,
        score: percentage,
        answers: result,
    });
};

export default submitTestController;
