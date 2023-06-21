import User from '../models/UserModel.js'
import cloudinary from 'cloudinary'
import fs from "fs"

export const getAllUsers = async (req, res) =>{
    try{
        const result = await User.find().populate('posts')
        res.status(200).json(result)
    }
    catch(err){
        res.status(500).send(err.message)
    }
}

export const singleUserDetails = async (req, res) => {
    try{
        /* const {userId} = req.params */

        // I want to search the user via his email
        const decodedEmail = req.email

        const result = await User.findOne({email:decodedEmail}).populate('posts')
        res.status(200).json(result)
    }
    catch(err){
        res.status(500).send(err.message)
    }

} 

export const createUser = async (req, res, next) =>{
    try{
        const {firstName, lastName, password, email,streetName, cityName, postalCode, houseNumber} = req.body
        const address = {
            streetName,
            cityName,
            postalCode,
            houseNumber
        }
     
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD,
            api_key:process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_SECRET_KEY
        })

        const alreadyExist = await User.findOne({email:email})
        if(alreadyExist !== null) {
            const err = new Error("Email already registered")
            err.statusCode = 400
            throw err
        }

        // Hashing the password inside the pre hook from Mongoose when we are registering the user

        // 1st Step : Generate salt using genSalt method from bcrypt

/*         const saltRounds = 11
        const salt = await bcrypt.genSalt(saltRounds)
        
        //2nd Step: Hash the password using hash method from bcrypt

        const hashedPassword = await bcrypt.hash(password, salt) */

        /* const newUser = await User.create(req.body) */

        /* Second Way to create the User */

        cloudinary.v2.uploader.upload(req.file.path,{public_id: Date.now() + req.file.filename}, async (err, result) => {
            if(err) {
                const error = new Error("Failed to upload the Image")
                error.statusCode = 400
                throw error
            }
            // Below line is only used to delete the image that is inside the image folder on backend after uploading is successful to the cloudinary
            fs.unlinkSync(req.file.path)
            const user = new User({
                firstName,
                lastName,
                email,
                address,
                hashedPassword: password,
                avatar: result.url // Its value will come after storing the image to the cloudinary and we will use the url returned from cloudinary
                
            })
            const newUser = await user.save()
    
            // We are deleting hashedPassword property and its value because we dont want to send this important information to the user back
            newUser.hashedPassword = undefined
    
            res.status(201).json(newUser)
        })

    }
    catch(err){
        next(err)
    }
}

export const updateUser = async (req, res) =>{

   try{ 
    const {userId, postId} = req.body
   /* 
    we have used it for one to one relation because our post property was just an OBjectId

    const result = await User.findByIdAndUpdate(userId, {post:postId}, {new: true}) */

    /* Now we want to have one to many relation , in which one user could have multiple posts created , so we will
    store Object ids of those posts inside the posts Array property of the user profile */

    const result = await User.findByIdAndUpdate(userId, {
        $push: {
            posts: postId
        }
    })
    res.status(202).json(result)
}
    catch(err){
        res.status(500).send(err.message)
    }
}

export const getGallery = async (req, res, next) => {
    try{
        const user = await User.findById(req.userId, {gallery : 1})
        
        if(user) return res.status(200).json({gallery: user.gallery})

        const err = new Error("Something went wrong")
        err.statusCode = 400
        throw err
    }
    catch(err){
        next(err)
    }
} 

export const uploadImages = async (req, res, next) => {
    try{
        const gallery = []
        req.files.map(img => gallery.push(img.filename))

        const user = await User.findByIdAndUpdate(req.userId, { $push: { gallery: {$each:gallery}} }, {new: true})
        if(user) return res.status(202).json({gallery: user.gallery})

        const err = new Error("Something went wrong")
        err.statusCode = 400
        throw err
    }
    catch(err){
        next(err)
    }
}