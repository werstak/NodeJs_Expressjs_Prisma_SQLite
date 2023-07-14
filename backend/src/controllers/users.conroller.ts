/**
 * will be realized through the prism
 * */

export type Admin = {
    id: number;
    email: String;
    firstName: string;
    lastName: string;
    role: number;
};

export const getUserHandler = async (): Promise<Admin[]> => {
    const res = [
        {
            id: 1,
            email: '1email@email.com',
            firstName: 'Bob',
            lastName: 'Diver',
            role: 1,
        },
        {
            id: 2,
            email: '2email@email.com',
            firstName: 'Aleks',
            lastName: 'Dap',
            role: 2,
        }
    ];

    console.log('Controller - USERS')

    return res
};
