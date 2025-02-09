import { PrismaClient } from '@prisma/client'
import { plainToInstance } from 'class-transformer'
import { ValidationError, validate } from 'class-validator'
import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { LoginDto } from '../dto/login.dto'
import { RegisterDto } from '../dto/register.dto'

const prisma = new PrismaClient()

export const register = async (req: Request, res: Response) => {
	try {
		const authDto = plainToInstance(RegisterDto, req.body)
		const errors = await validate(authDto)

		if (errors.length > 0) {
			res.status(400).json({ errors: formatErrors(errors) })
		}

		const existingUser = await prisma.user.findUnique({
			where: { email: authDto.email },
		})
		if (existingUser) {
			res.status(409).json({ error: 'User already exists' })
		}

		const newAccount = await prisma.user.create({
			data: {
				email: authDto.email,
				password: authDto.password,
			},
		})

		const token = generateToken(newAccount)
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
			res.status(400).json({ errors: formatErrors(errors) })
		}

		const user = await prisma.user.findUnique({
			where: { email: authDto.email },
		})
		if (!user || user.password !== authDto.password) {
			res.status(401).json({ error: 'Invalid credentials' })
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
	const payload = { userId: user.id, email: user.email }
	const secret = process.env.JWT_SECRET || 'secret'
	return jwt.sign(payload, secret, { expiresIn: '365d' })
}

const formatErrors = (errors: ValidationError[]): object[] => {
	return errors.map(err => {
		return err.constraints ? Object.values(err.constraints) : []
	})
}
