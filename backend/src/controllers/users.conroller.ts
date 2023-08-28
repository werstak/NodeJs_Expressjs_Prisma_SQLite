import db from '../utils/db';

/**
 * will be realized through the prisma
 * */


export const getAllUsersHandler = async (params: any): Promise<any> => {
    const {pageIndex, pageSize} = params;

    const totalCount = await db.user.count();
    const skip = pageIndex * pageSize;
    const users = await db.user.findMany({
        take: parseInt(pageSize),
        skip: skip,
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
    return {totalCount, users}
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

export const createUserHandler = async (user: Omit<any, 'id'>): Promise<any> => {
    const {firstName, lastName, email, password, role, avatar} = user;

    const newUser = await db.user.create({
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
    const totalCount = await db.user.count();
    return {totalCount, newUser}
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
