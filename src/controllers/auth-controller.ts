import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { RoleTypes, User } from '../models/user.model';
import { validateUserData } from '../middlewares/validation/validate-user';


export const registerUser = async (req: Request, res: Response) => {
    const { name, birthdate, email, password } = req.body;

    try {
        const validationResult = validateUserData(req.body);
        console.log('Validation result:', validationResult);

        if (!validationResult.isValid) {
            return res.status(400).json({
                success: false,
                errors: validationResult.errors,
                message: 'Ошибка валидации данных'
            });
        }

        const { name, birthdate, email, password } = validationResult.validatedData!;

        const existingActiveUser = await User.findOne(
            {
                where: {
                    email,
                    deactivatedAt: null
                }
            });
        if (existingActiveUser) {
            return res.status(409).json({
                success: false,
                message: 'Пользователь с таким email уже существует'
            });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = await User.create({
            name,
            birthdate,
            email,
            password: hashedPassword,
            role: RoleTypes.USER,
            deactivatedAt: null
        });

        res.json({
            success: true,
            message: 'Пользователь успешно создан'
        });
    } catch (error) {
        console.log(error);
        let errMsg = '';
        if (error instanceof Error) {
            console.log('eror here')
            errMsg = error.message || 'Internal server error';
        } else if (typeof error === 'string') {
            errMsg = error;
        } else {
            errMsg = 'Unknown error occurred.';
        }

        console.error(errMsg);
        return res.status(500).json({ error: errMsg });
    }
}