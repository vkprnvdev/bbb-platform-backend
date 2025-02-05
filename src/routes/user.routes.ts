import { Router } from 'express'
import {
	createUser,
	deleteUser,
	findUserById,
	updateUser,
} from '../controllers/user.controller'

const userRouter = Router()

userRouter.get('/:id', findUserById)
userRouter.post('/', createUser)
userRouter.put('/:id', updateUser)
userRouter.delete('/:id', deleteUser)

export default userRouter
