import db from '../utils/db';

/**
 * will be realized through the prism
 * */

export type User = {
    // id: number;
    // email: string;
    firstName: string;
    lastName: string;
    // posts?: []
};


export const getUsersHandler = async (): Promise<any[]> => {
    return db.user.findMany({
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
        },
    });
};


export const getUserHandler = async (id: number): Promise<any | null> => {
    return db.user.findUnique({
        where: {
            id,
        },
    });
};



// export const getUsersHandler = async (): Promise<User[]> => {
//     const res = [
//         {
//             id: 1,
//             email: '1email@email.com',
//             firstName: 'Bob',
//             lastName: 'Diver',
//         },
//         {
//             id: 2,
//             email: '2email@email.com',
//             firstName: 'Aleks',
//             lastName: 'Dap',
//         }
//     ];
//     console.log('Controller - USERS')
//     return res
// };




export const createUserHandler = async (
    user: Omit<any, "id">
): Promise<any> => {
    const { firstName, lastName, email } = user;
    return db.user.create({
        data: {
            firstName,
            lastName,
            email
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
        },
    });
};
