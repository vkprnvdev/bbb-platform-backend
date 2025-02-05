import { PrismaClient } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import { ValidationError, validate } from 'class-validator'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { UserDto } from '../dto/user.dto'

const prisma = new PrismaClient()

export const register = async (req: Request, res: Response) => {
	try {
		const authDto = plainToInstance(UserDto, req.body)
		const errors = await validate(authDto)

		if (errors.length > 0) {
			return res.status(400).json({ errors: formatErrors(errors) })
		}

		const existingUser = await prisma.user.findUnique({
			where: { email: authDto.email },
		})
		if (existingUser) {
			return res.status(409).json({ error: 'User already exists' })
		}

		const newUser = await prisma.user.create({
			data: {
				email: authDto.email,
				password: authDto.password,
				displayName: 
			},
		})

		const token = generateToken(newUser) // Функция генерации токена (см. ниже)
		res.status(201).json({ token })
	} catch (e) {
		console.error('Error in register:', e)
		res.status(500).json({ error: 'Server error' })
	}
}

export const login = async (req: Request, res: Response) => {
	try {
		const authDto = plainToInstance(LoginDto, req.body)
		const errors = await validate(authDto)

		if (errors.length > 0) {
			return res.status(400).json({ errors: formatErrors(errors) })
		}

		const user = await prisma.user.findUnique({
			where: { email: authDto.email },
		})
		if (!user || user.password !== authDto.password) {
			return res.status(401).json({ error: 'Invalid credentials' })
		}

		const token = generateToken(user)
		res.json({ token })
	} catch (e) {
		console.error('Error in login:', e)
		res.status(500).json({ error: 'Server error' })
	}
}

export const logout = async (req: Request, res: Response) => {
	res.json({ message: 'Logged out' })
}

const generateToken = (user: any): string => {
	const payload = { userId: user.id, email: user.email } //  Добавьте необходимые данные
	const secret = process.env.JWT_SECRET || 'your-secret-key' //  Используйте безопасный секретный ключ из переменных окружения
	return jwt.sign(payload, secret, { expiresIn: '1h' })
}

const formatErrors = (errors: ValidationError[]): object[] => {
	return errors.map(err => {
		return err.constraints ? Object.values(err.constraints) : []
	})
}
