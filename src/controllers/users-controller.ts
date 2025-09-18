import { Request, Response } from "express";
import { User } from "../models/user.model";


export const getUser = async (req: Request, res: Response) => {
    const requestedUserId = Number(req.params.id);
    console.log('requestedUserId', requestedUserId);

    const currentUserId = Number(req.userId);
    console.log('currentUserId', currentUserId)

    try {
        let canAccess = false;
        const currentUser = await User.findByPk(currentUserId);

        if (currentUser) {
            if (currentUserId === requestedUserId || currentUser.role === 'admin') {
                canAccess = true;
            }
        }
        if (!canAccess) {
            return res.status(403).send({ message: 'Access denied' });
        }
        const targetUser = await User.findByPk(requestedUserId);

        if (!targetUser) {
            return res.status(404).send({ message: 'Not found' });
        }

        if (targetUser.deactivatedAt !== null) {
            return res.status(403).send({ message: 'User is deactivated' });
        }

        const safeUser = {
            id: targetUser.id,
            name: targetUser.name,
            birthdate: targetUser.birthdate,
            email: targetUser.email,
            role: targetUser.role,
        };

        res.json(safeUser);

    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}


export const getUsers = async (req: Request, res: Response) => {
    const currentUserId = Number(req.userId);
    try {
        const currentUser = await User.findByPk(currentUserId);
        if (!currentUser) {
            return res.status(401).send({ message: 'Authentication required' });
        }
        if (currentUser.role !== 'admin') {
            return res.status(403).send({ message: 'Access denied' });
        }
        const allUsers = await User.findAll();
        const safeUsers = allUsers.map(user => ({
            id: user.id,
            name: user.name,
            birthdate: user.birthdate,
            email: user.email,
            role: user.role,
            deactivatedAt: user.deactivatedAt
        }));
        res.json(safeUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}


export const blockUser = async (req: Request, res: Response) => {
    const requestedUserId = Number(req.params.id);
    const currentUserId = Number(req.userId);

    try {
        const currentUser = await User.findByPk(currentUserId);
        if (!currentUser) {
            return res.status(401).send({ message: 'Authentication required' });
        }
        let canBlock = false;
        if (currentUserId === requestedUserId || currentUser.role === 'admin') {
            canBlock = true;
        }
        if (!canBlock) {
            return res.status(403).send({ message: 'Access denied' });
        }
        const targetUser = await User.findByPk(requestedUserId);
        if (!targetUser) {
            return res.status(404).send({ message: 'User not found' });
        }
        await targetUser.update({ deactivatedAt: new Date() });
        res.sendStatus(200);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}