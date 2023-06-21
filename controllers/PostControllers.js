import Post from '../models/PostsModel.js'

export const getAllPosts = async (req, res) =>{
    try{
        const result = await Post.find().populate('owner')
        res.status(200).json(result)
    }
    catch(err){
        res.status(500).send(err.message)
    }
}

export const singlePostDetails = async (req, res) => {
    try{
        const {postId} = req.params
        const result = await Post.findById(postId)
        res.status(200).json(result)
    }
    catch(err){
        res.status(500).send(err.message)
    }

} 

export const createPost = async (req, res) =>{
    try{
        const {title, description, content} = req.body
        const owner = req.userId
        const newPost = await Post.create({
            title,
            description,
            owner,
            content
        })
        res.status(201).json(newPost)
    }
    catch(err){
        res.status(500).send(err.message)
    }

}

export const deletePost = async (req, res) =>{
    try{
        const {postId} = req.params


        const result = await Post.findOneAndDelete({_id:postId, owner:req.userId})
        console.log(result)
        res.status(201).send("Deleted successfully")
    }
    catch(err){
        res.status(500).send("Something went wrong")
    }
}

export const updatePost = async (req, res) =>{
    
    try{    
        const {title, description, content, postId} = req.body

        // As there could be other useless properties and values sent in body that is why first creating a new
        // Object and then i will loop through this object to extract properties that have some values
        const bodyOfRequest = {
            title,
            description,
            content
        }
        const updateData = {}
        /* Looping through the newly created object bodyOfRequest to check which field need to be updated on database */
        for (const [key, value] of Object.entries(bodyOfRequest)){
            if(value) {updateData[key] = value}
        }
        console.log(updateData)
        const result = await Post.findOneAndUpdate({_id:postId, owner: req.userId}, updateData)
        res.status(201).send("Post updated successfully")
    }
    catch(err) {
        res.status(500).send("Something went wrong while updating the post")
    }
}