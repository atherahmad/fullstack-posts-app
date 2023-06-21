import mongoose from "mongoose";
import { addressSchema } from "./AddressModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { emailSender } from "../utils/emailSender.js";

export const userSchema = new mongoose.Schema({

    firstName: {
        type: String, required: true
    },
    lastName: {
        type: String, required: true
    },
    email: {
        type: String, required: true,unique: true
    },
    hashedPassword: {
        type: String, required: true
    },
address: {
        type: addressSchema,
        required: true
    },

    // This one for one To Many relation
posts:
{
    type: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }]
}, 
verified:{
    type: Boolean,
    default : false
},
avatar: {
    type: String
},
gallery: []
    /* 
Used for One to One relation
{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Post'

} */
}) 


userSchema.pre("save",async function(){

    const saltRounds = 11
    const salt = await bcrypt.genSalt(saltRounds)
    const newlyCreateHashedPswd = await bcrypt.hash(this.hashedPassword, salt)


    /* Previously we have assigned a fake value to the hashedPassword inside create User controller to avoid error of Schema validation
    where it was clearly mentioned that hashedPassword is required true */
    /* So after hashing the plain text password we will update the hashedPassword property of this document */

    this.hashedPassword = newlyCreateHashedPswd

})

userSchema.post("save", async (doc, next)=>{

try{    
    //Generating a token that we want to pass in email, to verify a user's email address
    const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
     
    const payload = {
        email: doc.email,
        firstName:doc.firstName,
        userId: doc._id
    } 
    const token = jwt.sign(payload,JWT_SECRET_KEY, {expiresIn: 3600})

      // sending email to user that his account has been created

      // Declaring the variables that we can pass to the function that is responsible for sending the email
      const subject = 'Account created at POST-APP'
      const plainText = `Ẁelcome ${doc.firstName}! Your account has been created with use`
      const htmlText = `
                          <h2>Welcome ${doc.firstName}!</h2>
                          <br/>
                          <p>Welcome to posts-app. your  account has been created successfully</p>
                          <p>Please click on the below link to confirm your email and activate your account</p>
                          <a href="http://localhost:3000/confirm-email/${token}">Confirm</a>`

        const emailStatus = await emailSender(doc.email, subject, plainText, htmlText)
        if(!emailStatus) {
            const err =  new Error("Failed to send email")
            err.statusCode = 400
            throw err
        }
    }
    catch(err){
        next(err)
    }
})

userSchema.post("findOne", async function(doc, next){
   console.log('post called after making findOne query')
})

export default mongoose.model('User', userSchema, 'User')
