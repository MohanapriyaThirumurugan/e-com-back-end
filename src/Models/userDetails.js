import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { randomBytes, createHash } from 'crypto';


const { Schema } = mongoose; // Destructure Schema from mongoose


const userschema= new Schema({
    name : {
        type: String,
        required: [true, 'Please enter name']
    },
    email:{
        type: String,
        required: [true, 'Please enter email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter password'],
        maxlength: [6, 'Password cannot exceed 6 characters'],
        select: false
    },
    avatar: {
        type: String,
        // required: true

    },
    role :{
        type: String,
        default:"admin"
    
    },
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
    
    createdAt :{
        type: Date,
        default: Date.now
    }
    
})

// hash tha password
userschema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) {
            return next(); // If password is not modified, move to the next middleware
        }
        // Generate the hash only if the password is modified
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        return next(error);
    }
});

// userschema.pre('save', async function (next){
//  if(this.isModified('password'))
//  next()
//     this.password  = await bcrypt.hash(this.password, 10)
// })

// create jwt function where you just call the function
userschema.methods.getJwtToken = function(){

    return jwt.sign({id: this.id}, process.env.sckey, {
         expiresIn: process.env.exptime
     })
 }
 // comapare user using login function where you can get
 userschema.methods.isValidPassword = async function(enteredPassword){
    return await  bcrypt.compare(enteredPassword, this.password)
}


// Your schema definition...

userschema.methods.getResetToken = function() {
    // Generate Token
    const token = randomBytes(20).toString('hex');

    // Generate Hash and set to resetPasswordToken using sha256 algorithm
    const resetPasswordToken = createHash('sha256').update(token).digest('hex');

    // Set token expire time
    const resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000;

    // Store the hash and expiration time in the user document
    this.resetPasswordToken = resetPasswordToken;
    this.resetPasswordTokenExpire = resetPasswordTokenExpire;

    return token;
}

const userdatabase=mongoose.model('userdetail',userschema)

export default userdatabase
