import db from '../utils/db';

/**
 * will be realized through the prisma
 * */

export const loginUserHandler = async (email: string): Promise<any | null> => {
    return db.user.findUnique({
        where: {
            email: email,
        },
    });
};
