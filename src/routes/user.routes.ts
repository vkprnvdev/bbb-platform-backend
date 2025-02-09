import { Router } from 'express'
import {
	authenticateJWT,
	deleteUser,
	updateUser,
} from '../controllers/user.controller'

const userRouter = Router()

userRouter.put('/:id', authenticateJWT, updateUser)
userRouter.delete('/:id', authenticateJWT, deleteUser)

export default userRouter
