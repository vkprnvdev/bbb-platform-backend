import { Router } from 'express'
import {
	createUser,
	deleteUser,
	findUserById,
	updateUser,
} from '../controllers/auth.controller'

const authRouter = Router()

authRouter.get('/:id', findUserById)
authRouter.post('/', createUser)
authRouter.put('/:id', updateUser)
authRouter.delete('/:id', deleteUser)

export default authRouter
