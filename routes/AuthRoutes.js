import express from "express"
import {loginHandler, passwordChangeHandler, authorizeUser, emailConfirmationHandler, passwordReset, passwordRecovery} from '../controllers/AuthControllers.js'
import { authorizationHandler } from "../middleware/authorization.js"

const router = express.Router()

router.post('/login', loginHandler)
router.put('/change-password',authorizationHandler, passwordChangeHandler)
router.get('/authorize-user', authorizationHandler, authorizeUser)
router.get('/confirm-email/:token', emailConfirmationHandler)
router.post('/password-reset', passwordReset)
router.put('/password-reset', passwordRecovery)



export default router