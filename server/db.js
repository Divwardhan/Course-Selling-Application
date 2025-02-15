const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema;
const userSchema = new Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }

    }
);

const courseSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    imageUrl:{
        type:String,
        required:true
    },
    videos:{
        type:Array
    },
    creatorId:{
        type:ObjectId,
    }
});

const adminSchema = new Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }


    }
);

const purchaseSchema = new Schema({
    userId:{
        type:ObjectId,
        required:true
    },
    courseId:{
        type:ObjectId,
        required:true
    },
});


const purchase2Schema = new Schema({
    userId:{
        type:ObjectId,
        required:true
    },
    courseId:{
        type:ObjectId,
        required:true
    },
});
const userModel = mongoose.model("users",userSchema);
const courseModel = mongoose.model("courses",courseSchema);
const adminModel = mongoose.model("admins",adminSchema);
const purchase2Model = mongoose.model("purchase2",purchase2Schema);

module.exports = {
    userModel,
    courseModel,
    adminModel, 
    purchase2Model
};