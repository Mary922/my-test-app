import { sequelize } from "../connection";
import { hashPassword } from "../../utils/hashPassword";
import { User, RoleTypes, initUserModel } from "../../models/user.model";

async function seedUsers() {
    try {
        initUserModel(sequelize);
        await sequelize.sync({ force: false });

        const initialUsers = [
            {
                id: 1,
                name: 'Иванов Иван Петрович',
                birthdate: '1885-01-17',
                email: 'ivan@example.com',
                password: 'mypasswordfirst123',
                role: RoleTypes.ADMIN,
                deactivatedAt: null
            },
            {
                id: 2,
                name: 'Смирнов Александр Юрьевич',
                birthdate: '1990-10-14',
                email: 'alex@example.com',
                password: 'mypasswordsecond456',
                role: RoleTypes.USER,
                deactivatedAt: null
            },
        ]

        const hashedUsers = await Promise.all(
            initialUsers.map(async (user) => ({
                ...user,
                birthdate: new Date(user.birthdate),
                password: await hashPassword(user.password)
            }))
        )
        await User.bulkCreate(hashedUsers);
        console.log('Пользователи успешно созданы.');

    } catch (error) {
        console.error('Ошибка при создании пользователей:', error);
    } finally {
        await sequelize.close();
    }
}
seedUsers();
