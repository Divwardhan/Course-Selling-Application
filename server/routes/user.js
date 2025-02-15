const { Router } = require('express');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')
const userRouter = Router();
const {userModel, courseModel, purchase2Model} = require("../db");
const { userMiddleware } = require('../middlewares/user');
// const JWT_USER_SECRET = require('../config')


async function hashpassword(password){
    const saltRounds = 10;
    const hashedpassword = await bcrypt.hash(password , saltRounds)
    return hashedpassword 
}

userRouter.post("/signup" ,async function(req,res){
    const {firstName,lastName,email,password} = req.body;
    const hashedpassword = await hashpassword(password);

    const user = await userModel.findOne({email});

    if(user){
        res.status(400).json({
            message:"user already exists"
        })
        return;
    }

    try{
        await userModel.create({firstName,lastName,email,password:hashedpassword});
        res.status(201).json({
            message:"user created successfully"
        })
    }
    catch(err){
        res.status(400).json({
            message:"admin creation failed"
        })
    }

})

userRouter.post("/signin" , async function(req,res){
    const {email,password} = req.body
    console.log(email , password)

    try{
    const user = await userModel.findOne({email});
    console.log(user.firstName)
    if(!user){
        return res.status(404).json({
            msg:'user not found'
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid)
    {
        return res.status(403).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({
        id:user._id
    },process.env.JWT_USER_SECRET);

    res.set('Token', `Bearer ${token}`);
    return res.json({
        token:token,
        msg:'Signin Successful'
    })

    }
    
    catch(err){  
        console.log(err)
    return res.status(403).json({
        message:"Signin failed",
        err
    })
    }
})

userRouter.get("/purchases",userMiddleware, async function (req, res) {
    try {

        const userId = req.userId;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const purchases = await purchase2Model.find({ userId });
        if (!purchases.length) {
            return res.status(404).json({ message: "No purchases found for this user" });
        }
        
        const courseIds = purchases.map((purchase) => purchase.courseId);

        const courses = await courseModel.find({ _id: { $in: courseIds } });

        res.json({
            message: "All the courses purchased by the user",
            courses
        });
    } catch (error) {
        console.error("Error in /purchases endpoint:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// userRouter.post('/create-order', async function(req, res){ 
//     const { price } = req.body;
//     try {
//         const response = await axios.post(
//             `${PAYPAL_API}/v2/checkout/orders`,
//             {
//                 intent: 'CAPTURE',
//                 purchase_units: [
//                     {
//                         amount: {
//                             currency_code: 'USD',
//                             value: price,
//                         },
//                     },
//                 ],
//             },
//             {
//                 auth: {
//                     username: PAYPAL_CLIENT,
//                     password: PAYPAL_SECRET,
//                 },
//             }
//         );
//         res.json(response.data);
//     } catch (err) {
//         res.status(500).send(err.message);
//     }
// });
module.exports ={
    userRouter
};
    
