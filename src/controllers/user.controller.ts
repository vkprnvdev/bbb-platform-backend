import { PrismaClient } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { UserDto } from '../dto/user.dto'

const userClient = new PrismaClient()

interface CustomRequest extends Request {
	user?: any
}

export const authenticateJWT = (
	req: CustomRequest,
	res: Response,
	next: NextFunction
) => {
	const authHeader = req.headers.authorization

	if (authHeader) {
		const token = authHeader.split(' ')[1]
		jwt.verify(token, process.env.JWT_SECRET!, (err: any, decoded: any) => {
			if (err) {
				res.status(403).json({ error: 'Invalid or expired token' })
			}
			req.user = decoded
			next()
		})
	} else {
		res.status(401).json({ error: 'Authorization header missing' })
	}
}

export const updateUser = async (req: CustomRequest, res: Response) => {
	try {
		if (!req.user) res.status(401).json({ error: 'Unauthorized' })

		const userDto = plainToInstance(UserDto, req.body)
		const errors = await validate(userDto)

		if (errors.length > 0) {
			res.status(400).json({ errors: formatErrors(errors) })
		} else {
			const user = await userClient.user.update({
				where: {
					id: req.params.id,
				},
				data: userDto,
			})

			if (!user) {
				res.status(404).json({ error: 'User not found' })
			} else {
				res.status(200).json({ data: user })
			}
		}
	} catch (e) {
		console.error('Error in updateUser:', e)
		res.status(500).json({ error: 'Server error' })
	}
}

export const deleteUser = async (req: CustomRequest, res: Response) => {
	try {
		if (!req.user) res.status(401).json({ error: 'Unauthorized' })

		const user = await userClient.user.delete({
			where: {
				id: req.params.id,
			},
		})

		if (!user) {
			res.status(404).json({ error: 'User not found' })
		} else {
			res.status(200).json({ data: {} })
		}
	} catch (e) {
		console.error('Error in deleteUser:', e)
		res.status(500).json({ error: 'Server error' })
	}
}

const formatErrors = (errors: ValidationError[]): object[] => {
	return errors.map(err => {
		return err.constraints ? Object.values(err.constraints) : []
	})
}
