import { UserRole } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class UserDto {
	@IsString({ message: 'Имя должно быть строкой' })
	@IsNotEmpty({ message: 'Имя обязательно для заполнения' })
	displayName?: string

	@IsOptional()
	@IsString({ message: 'Путь к аватарке должен быть строкой' })
	picture?: string

	@IsEnum(UserRole, { message: 'Неверная роль пользователя' })
	role: UserRole = UserRole.STUDENT
}
