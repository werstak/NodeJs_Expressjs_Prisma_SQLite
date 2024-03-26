import db from '../utils/db';

/**
 * will be realized through the prisma
 * */


export const getAllUsersHandler = async (params: any): Promise<any> => {
    const {orderByColumn, orderByDirection, pageIndex, pageSize, firstName, lastName, email, roles} = params;

    const parseRoles = JSON.parse(roles);
    console.log('ROLES', parseRoles)
    let rolesArr;
    if (parseRoles.length) {
        rolesArr = parseRoles;
    } else {
        rolesArr = [1, 2, 3, 4];
    }

    const skip = pageIndex * pageSize;
    const totalCount = await db.user.count();

    const users = await db.user.findMany({
        where: {
            role: {in: rolesArr},
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
            posts: true,
            status: true,
            birthAt: true,
            location: true
        },
    });
    return {totalCount, users}
};


export const getListAllUsersHandler = async (): Promise<any> => {
    const users = await db.user.findMany({
        select: {
            id: true,
            firstName: true,
            lastName: true
        },
    });
    return {users}
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
            posts: true,
            status: true,
            birthAt: true,
            location: true
        },
    });
};

export const createUserHandler = async (user: Omit<any, 'id'>): Promise<any> => {
    const {firstName, lastName, email, password, role, avatar, status, birthAt, location} = user;

    const newUser = await db.user.create({
        data: {
            firstName,
            lastName,
            email,
            password,
            role,
            avatar,
            status,
            birthAt,
            location
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
            posts: true,
            status: true,
            birthAt: true,
            location: true
        },
    });
    const totalCount = await db.user.count();
    return {totalCount, newUser}
};

export const updateUserHandler = async (
    user: Omit<any, 'id'>,
    id: number
): Promise<any> => {
    const {firstName, lastName, email, role, avatar, status, birthAt, location} = user;

    return db.user.update({
        where: {
            id,
        },
        data: {
            firstName,
            lastName,
            email,
            role,
            avatar,
            status,
            birthAt,
            location
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
            posts: true,
            status: true,
            birthAt: true,
            location: true
        },
    });
};



// export const updateUserHandler = async (
//     user: Omit<any, 'id'>,
//     id: number
// ): Promise<any> => {
//     const {firstName, lastName, email, password, role, avatar, status, birthAt, location} = user;
//
//     return db.user.update({
//         where: {
//             id,
//         },
//         data: {
//             firstName,
//             lastName,
//             email,
//             password,
//             role,
//             avatar,
//             status,
//             birthAt,
//             location
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
//             posts: true,
//             status: true,
//             birthAt: true,
//             location: true
//         },
//     });
// };

export const deleteUserHandler = async (id: number): Promise<void> => {
    await db.user.delete({
        where: {
            id,
        },
    });
};

/**
 * This applies to authentication
 */
export const findUserById = async (id: any): Promise<any | null> => {
    console.log(3333333, 'findUserById', id)
    return db.user.findUnique({
        where: {
            id,
        },
    });
};
