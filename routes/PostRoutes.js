import express from "express"
import {getAllPosts, singlePostDetails, createPost, deletePost, updatePost} from '../controllers/PostControllers.js'
import { authorizationHandler } from "../middleware/authorization.js"

const router = express.Router()

router.post('/create-post',authorizationHandler, createPost)
router.get('/all-posts', getAllPosts)
router.get('/post-details/:postId', singlePostDetails)
router.delete('/delete-post/:postId',authorizationHandler, deletePost)
router.put('/update-post', authorizationHandler, updatePost)

export default router

/* 647d97f090595f26e42fcfe7 */