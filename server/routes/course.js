const { Router } = require('express');
const { userMiddleware } = require('../middlewares/user');
const { purchase2Model, courseModel } = require('../db');
const courseRouter = Router();

courseRouter.get("/preview" ,async function(req,res){
    try{
        
        const courses = await courseModel.find()
        const Course = courses.map(course => ({title : course.title ,description: course.description ,price: course.price ,imageUrl: course.imageUrl}))


        res.status(200).json({
            message:"all courses",
            Course

        })
}
    catch(err){
        res.status(404).json({
            msg:"Could not fetch courses",
            Course
        })
    }

})



courseRouter.post('/fetch', async function (req, res) {
    try {
        const {title} = req.body;
        const course = await courseModel.findOne({title : title})
        res.json({
            message:"course fetched",
            course
        })

    } catch (err) {
        res.json({
            msg:"Could not fetch course",
            err
        })
    }
});
courseRouter.post("/purchase", userMiddleware, async function (req, res) {
    try {
      const userId = req.userId;
  
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
  
      const { courseId } = req.body;
  
      // Check if the course is already purchased
      const isAlreadyPurchased = await purchase2Model.findOne({
        courseId: courseId,
        userId: userId,
      });
  
      if (isAlreadyPurchased) {
        console.log("Already purchased");
        return res.status(400).json({
          message: "You have already purchased this course.",
        });
      }
  
      const purchase = await purchase2Model.create({
        courseId: courseId,
        userId: userId,
      });
  
      return res.json({
        message: "Course purchased successfully!",
        purchase,
      });
    } catch (err) {
      console.error("Error during purchase process:", err.message); 
      return res.status(500).json({
        message: "An error occurred during the purchase process. Please try again later.",
        error: err.message,
      });
    }
  });
  


module.exports = {
    courseRouter
};