const { Router } = require('express');
const adminRouter = Router();
const {adminModel, courseModel} = require("../db");
const { adminMiddleware } = require('../middlewares/admin');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

async function hashpassword(password){
    const saltRounds = 10;
    const hashedpassword = await bcrypt.hash(password , saltRounds)
    return hashedpassword 
}

adminRouter.post("/signup" ,async function(req,res){
    const {firstName,lastName,email,password} = req.body;
    const hashedpassword = await hashpassword(password);

    const user = await adminModel.findOne({email});

    if(user){
        res.status(400).json({
            message:"admin already exists"
        })
        return;
    }

    try{
        await adminModel.create({firstName,lastName,email,password:hashedpassword});
        res.status(201).json({
            message:"admin created successfully"
        })
    }
    catch(err){
        res.status(400).json({
            message:"admin creation failed"
        })
    }

})

adminRouter.post("/signin", async function(req, res) {
    const { email, password } = req.body;

    try {
        const admin = await adminModel.findOne({ email });
        if (!admin) {
            return res.status(404).json({
                msg: 'Admin not found'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(403).json({
                message: 'Invalid password'
            });
        }

        const token = jwt.sign({
            id: admin._id
        }, process.env.JWT_ADMIN_SECRET, { expiresIn: '1h' });

        res.header('token', `Bearer ${token}`);

        res.status(200).json({
            token: token,
            msg: 'Signin Successful'
        });
    } catch (error) {
        console.error("Signin error:", error);
        res.status(500).json({
            msg: "Signin failed",
            error: error.message
        });
    }
});



adminRouter.post("/course", adminMiddleware, async function (req, res) {
    try {
        const adminId = req.userId;

        const { title, description, imageUrl, price, videos } = req.body;

        if (!title || !description || !imageUrl || !price || !videos) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const course = await courseModel.create({
            title,
            description,
            imageUrl,
            price,
            videos,
            creatorId: adminId,
        });

        res.json({
            message: "Course created successfully",
            courseId: course._id,
        });
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});



adminRouter.put("/course" ,adminMiddleware, async function(req,res){
    const adminId = req.userId
    const {title , description , imageUrl , price ,videos, courseId} = req.body ; 
    try{
        const course= await courseModel.updateOne({
            _id:courseId,
            creatorId:adminId
        },{
            title,description,imageUrl,price,videos
        })

        if(!course.matchedCount) {
            throw new Error("Course not created by the respective creator so cannot update")   
        }

        res.json({
            message:"update course endpoint"
        })
    }
    catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({
            msg: "Internal server error",
            error: error.message
        });    
}
});

adminRouter.delete("/course" ,adminMiddleware , async function(req,res){
    const adminId = req.userId;
    const {courseId} = req.body;
    try{
        console.log(courseId , adminId)
        const del = await courseModel.deleteOne({_id:courseId , creatorId : adminId});

        console.log(del);
        
        if(!del.deletedCount){
            throw new Error("Course not created by you")
        }

        res.json({
            message:"delete course endpoint"
        })
    }
    catch(err){
        res.status(404).json({
            msg:"Course not deleted due to some unexpected error",
            error:err.message
        })
    }
    
})

adminRouter.get("/course/bulk" ,adminMiddleware ,  async function(req,res){
    const adminId = req.userId;
    try{
        const courses = await courseModel.find({
            creatorId:adminId
        });

        res.json({
            message:"return courses",
            courses
        })
    }
    catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({
            msg: "Internal server error",
            error: error.message
        });    
}
})


module.exports ={
    adminRouter
};

