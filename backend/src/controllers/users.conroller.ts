import db from '../utils/db';
// import { User } from '../models/user.model';

/**
 * will be realized through the prisma
 * */


export const getAllUsersHandler = async (): Promise<any[]> => {
    return db.user.findMany({
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            role: true,
            avatar: true,
            posts: true
        },
    });
};

export const getUserHandler = async (id: number): Promise<any | null> => {
    return db.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            password: true,
            createdAt: true,
            updatedAt: true,
            role: true,
            avatar: true,
            posts: true
        },
    });
};

export const createUserHandler = async (
    user: Omit<any, 'id'>
): Promise<any> => {
    const {firstName, lastName, email, password, role, avatar} = user;
    return db.user.create({
        data: {
            firstName,
            lastName,
            email,
            password,
            role,
            avatar
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            role: true,
            avatar: true,
            posts: true
        },
    });
};

export const updateUserHandler = async (
    user: Omit<any, 'id'>,
    id: number
): Promise<any> => {
    const {firstName, lastName, email, password, role, avatar} = user;
    return db.user.update({
        where: {
            id,
        },
        data: {
            firstName,
            lastName,
            email,
            password,
            role,
            avatar
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            role: true,
            avatar: true,
            posts: true
        },
    });
};


export const deleteUserHandler = async (id: number): Promise<void> => {
    await db.user.delete({
        where: {
            id,
        },
    });
};
