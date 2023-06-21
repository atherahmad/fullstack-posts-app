import express from "express"
import {getAllUsers, singleUserDetails, createUser, updateUser , getGallery , uploadImages} from '../controllers/UserControllers.js'
import { authorizationHandler } from "../middleware/authorization.js"

import multer from 'multer'
const upload = multer({dest: 'build/images/'})


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'build/images')
    },
    filename: function (req, file, cb) {
      const extName = file.mimetype.split('/')[1]
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9 )+ '.' + extName
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
  const updatedUpload = multer({ storage: storage })

const router = express.Router()

router.post('/create-user', upload.single('image'),createUser)
router.get('/all-users', getAllUsers)
router.get('/user-details', authorizationHandler, singleUserDetails)
router.patch('/user-update', updateUser)
router.get('/gallery', authorizationHandler, getGallery)
router.post('/uploads', authorizationHandler,  updatedUpload.array("images"), uploadImages)


export default router