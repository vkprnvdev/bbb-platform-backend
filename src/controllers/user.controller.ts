import { PrismaClient } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'
import { Request, Response } from 'express'
import { UserDto } from '../dto/user.dto'

const userClient = new PrismaClient().user

export const findUserById = async (req: Request, res: Response) => {
	try {
		const user = await userClient.findUnique({
			where: {
				id: req.params.id,
			},
			include: {
				subjects: true,
			},
		})

		if (!user) {
			res.status(404).json({ error: 'User not found' })
		} else {
			res.status(200).json({ data: user })
		}
	} catch (e) {
		console.error('Error in findUserById:', e)
		res.status(500).json({ error: 'Server error' })
	}
}

export const createUser = async (req: Request, res: Response) => {
	try {
		const userDto = plainToInstance(UserDto, req.body)
		const errors = await validate(userDto)

		if (errors.length > 0) {
			res.status(400).json({ errors: formatErrors(errors) })
		} else {
			const user = await userClient.create({
				data: userDto,
			})

			res.status(201).json({ data: user })
		}

		console.log(req.body)
	} catch (e) {
		console.error('Error in createUser:', e) // Используем console.error
		res.status(500).json({ error: 'Server error' })
	}
}

export const updateUser = async (req: Request, res: Response) => {
	try {
		const userDto = plainToInstance(UserDto, req.body)
		const errors = await validate(userDto)

		if (errors.length > 0) {
			res.status(400).json({ errors: formatErrors(errors) })
		} else {
			const user = await userClient.update({
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

export const deleteUser = async (req: Request, res: Response) => {
	try {
		const user = await userClient.delete({
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
