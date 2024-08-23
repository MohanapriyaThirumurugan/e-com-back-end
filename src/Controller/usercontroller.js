import ErrorHandler from "../Common/errorHandler.js";
import errorhandlerasync from '../Common/Asyncerrorhandler.js'
import userdata from "../Models/userDetails.js";
import sendtoken  from "../utils/auth.js";
import asyncerrorhandler from "../Common/Asyncerrorhandler.js";
import sendEmail from "../utils/email.js";
import cloudinary from "../cloudinary.js";
import CryptoJS from "crypto-js";
import userdatabase from "../Models/userDetails.js";
import crypto from 'crypto';
import dotenv from 'dotenv'
dotenv.config()



// register user
const register = async (req, res, next) => {
    try {
        console.log("Request body:", req.body);
        console.log("Request file:", req.file);

        const { name, email, password } = req.body;
        let avatar = [];

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, { folder: 'user' });
            avatar = result.secure_url; // Save the URL directly
        }

        const user = await userdata.create({
            name,
            email,
            password,
            avatar
        });

        sendtoken(user, 201, res);
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
};
const login =errorhandlerasync(async(req,res,next)=>{
    const {email,password}=req.body
    if(!password||!email){
        return next(new ErrorHandler('please enter the password &email',401) )
    }
    const user=await userdata.findOne({email}).select('+password')
    if(!user){
        return next(new ErrorHandler('please enter valid the password &email',401) )
    }
    if(!(await user.isValidPassword(password))){
        return next(new ErrorHandler('please enter valid the password &email',401) )
    }
    sendtoken(user,200,res)

})

const logoutUser = (req, res, next) => {
    // logut the user null means token token i the cookies
    res.cookie('token',null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    .status(200)
    .json({
        success: true,
        message: "Loggedout"
    })

}
const forgotpasword=(asyncerrorhandler(async(req,res,next)=>{
    const user=await userdata.findOne({email:req.body.email})
    console.log(user);
    if(!user){
        return next(new ErrorHandler('user not found',404) )
}
const resettoken=user.getResetToken()
await user.save({ validateBeforeSave: false });

console.log(resettoken);


// cereate reset url 
let BASE_URL = process.env.FRONTEND_URL;
if(process.env.NODE_ENV === "production"){
    BASE_URL = `${req.protocol}://${req.get('host')}`
}

const reseturl=`${BASE_URL}/resetpassword/${resettoken}`

const message=` your password rest url is fallow\n\n${reseturl} if you not reset pls ignore`

// sometime mail not send 
const option={
    to:user.email,
    subject:"pass word recovery",
    text:message 
}
try {
   await  sendEmail(option)
    res.status(200).json({
        success:true,
        message:`email send to ${user.email}`
    })
    
} catch (error) {
    user.resetPasswordToken=undefined
    user.resetPasswordTokenExpire=undefined
    await user.save({validateBeforeSave:false})
    return next(new ErrorHandler(error.message),500 )

}

}))

const resetPassword = asyncerrorhandler( async (req, res, next) => {
    
    const resetPasswordToken =  crypto.createHash('sha256').update(req.params.token).digest('hex'); 
    // console.log("Token from URL:", req.params.token);
    // console.log("Hashed token:", resetPasswordToken);
 
     const user = await userdatabase.findOne( {
         resetPasswordToken,
         resetPasswordTokenExpire: {
             $gt : Date.now()
         }
     } )
 
     if(!user) {
         return next(new ErrorHandler('Password reset token is invalid or expired'));
     }
 
     if( req.body.password !== req.body.confirmPassword) {
         return next(new ErrorHandler('Password does not match'));
     }
 
     user.password = req.body.password;
     user.resetPasswordToken = undefined;
     user.resetPasswordTokenExpire = undefined;
     await user.save({validateBeforeSave: false})
     sendtoken(user, 201, res)
 
 })

const changepassword = async (req, res, next) => {
    console.log(req.body);
    try {
        const trimmedId = req.params.id.trim(); // Trim the ID parameter
        console.log(trimmedId);

        const user = await userdata.findById(trimmedId).select('+password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isOldPasswordValid = await user.isValidPassword(req.body.oldPassword);
        if (!isOldPasswordValid) {
            return res.status(401).json({ success: false, message: 'Old password is incorrect' });
        }

        // Proceed to update the password
        user.password = req.body.password;
        await user.save();

        // Return success response
        return res.status(200).json({ success: true, user });
    } catch (error) {
        // Log the error for debugging
        console.error('Error in changepassword:', error);

        // Handle other errors
        return res.status(500).json({ success: false, message: 'An unexpected error occurred', error: error.message });
    }
};

// my profile
const getUserProfile = asyncerrorhandler(async (req, res, next) => {
    const user = await userdatabase.findById(req.user.id)
    res.status(200).json({
         success:true,
         user
    })
 })
 
const updateprofile = asyncerrorhandler(async (req, res, next) => {
    try {
        let newUserData = {
            name: req.body.name,
            email: req.body.email
        }
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, { folder: 'user' });
            newUserData.avatar = result.secure_url; // Add avatar URL to user data
        }

        const user = await userdata.findByIdAndUpdate(req.params.id, newUserData, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});



const getAllUsers = asyncerrorhandler(async (req, res, next) => {
    const users = await userdata.find();
    res.status(200).json({
         success: true,
         users
    })
 }) // authentication fail
 
 //Admin: Get Specific User using id
 const getUserbyId = asyncerrorhandler(async (req, res, next) => {
    console.log(req.params.id.trim());
    try {
         const user = await userdata.find({_id:req.params.id.trim()});
    
     if(!user) {
         return next(new ErrorHandler(`User not found with this id ${req.params.id}`,401))
     }
     res.status(200).json({
         success: true,
         user
    })
    } catch (error) {
        console.log(error);
    }
   
 });


 //Admin: Update User by id
 const updateUser =asyncerrorhandler(async (req, res, next) => {
     const newUserData = {
         name: req.body.name,
         email: req.body.email,
         role: req.body.role
     }
     console.log(newUserData);
     const user = await userdata.findByIdAndUpdate(req.params.id, newUserData, {
         new: true,
         runValidators: true,
     })
 
     res.status(200).json({
         success: true,
         user
     })
 })
 
 //Admin: Delete User byid
 const deleteUser = asyncerrorhandler(async (req, res, next) => {
     const user = await userdata.findById(req.params.id);
     if(!user) {
         return next(new ErrorHandler(`User not found with this id ${req.params.id}`))
     }
     await user.deleteOne();
     res.status(200).json({
         success: true,
     })
 })
export default{
   register,
   login,
   logoutUser,
   forgotpasword,
   resetPassword,
   getUserProfile,
   changepassword,
   updateprofile,
   getAllUsers,
   updateUser,
   getUserbyId,
   deleteUser
   
} 