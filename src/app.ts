import dotenv from 'dotenv';

import express from 'express';
import cors from 'cors';
import { initializeDatabase, initModels } from './database/initialize';
import { sequelize } from './database/connection';
import AuthRoutes from './routes/auth-routes';
import UsersRoutes from './routes/users-routes';

dotenv.config();
const app = express();
const port = 3001;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


async function startApp(): Promise<void> {
    try {

        const models = initModels(sequelize);

        await initializeDatabase();

        app.use('/api', AuthRoutes);
        app.use('/api', UsersRoutes);


        // 404 handler
        app.use((req, res) => {
            res.status(404).json({ message: 'Not Found' });
        });


        app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

    } catch (error) {
        console.error('Error connecting to database:', error);
        process.exit(1);
    }
}

startApp();

export { app };