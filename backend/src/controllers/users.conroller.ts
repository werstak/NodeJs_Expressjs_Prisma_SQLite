import db from '../utils/db';

/**
 * will be realized through the prisma
 * */


export const getAllUsersHandler = async (params: any): Promise<any> => {
    const {orderByColumn, orderByDirection, pageIndex, pageSize, firstName, lastName, email} = params;

    console.log(111111, 'getAllUsersHandler', params)

    let sortCol = {email: 'asc'};

    // sortCol[orderByColumn] = "red";


    const totalCount = await db.user.count();
    const skip = pageIndex * pageSize;

    const users = await db.user.findMany({
        where: {
            firstName: {
                startsWith: firstName,
            },
            lastName: {
                startsWith: lastName,
            },
            email: {
                startsWith: email
            }
        },
        take: parseInt(pageSize),
        skip: skip,
        orderBy: {
            [orderByColumn]: orderByDirection,
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
    return {totalCount, users}
};


// export const getAllUsersHandler = async (params: any): Promise<any> => {
//     const {orderByColumn, orderByDirection, pageIndex, pageSize, firstName, lastName, email} = params;
//
//     console.log(111111, 'getAllUsersHandler', params)
//
//     let sortCol = {email: 'asc'};
//
//     // sortCol[orderByColumn] = "red";
//
//
//     const totalCount = await db.user.count();
//     const skip = pageIndex * pageSize;
//
//     const users = await db.user.findMany({
//         take: parseInt(pageSize),
//         skip: skip,
//         orderBy: {
//             [orderByColumn]: orderByDirection,
//         },
//         select: {
//             id: true,
//             firstName: true,
//             lastName: true,
//             email: true,
//             createdAt: true,
//             updatedAt: true,
//             role: true,
//             avatar: true,
//             posts: true
//         },
//     });
//     return {totalCount, users}
// };

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
