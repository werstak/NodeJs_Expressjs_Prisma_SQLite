import db from '../utils/db';
import { hashToken } from '../utils/hashToken'
/**
 * will be realized through the prisma
 * */

export const findUserByEmail = async (email: string): Promise<any | null> => {
    return db.user.findUnique({
        where: {
            email: email,
        },
    });
};


export const addRefreshTokenToWhitelist = async ({ jti, refreshToken, userId }: any): Promise<any | null> => {
    return db.refreshToken.create({
        data: {
            id: jti,
            hashedToken: hashToken(refreshToken),
            userId: userId
        },
    });
}


export const findRefreshTokenById = async (id: any): Promise<any | null> => {
    console.log(2222, 'findRefreshTokenById', id)
    return db.refreshToken.findUnique({
        where: {
            id,
        },
    });
}


export const deleteRefreshToken = async (id: any): Promise<any | null> => {
    console.log(44444444, 'deleteRefreshToken', id)
    return db.refreshToken.update({
        where: {
            id,
        },
        data: {
            revoked: true
        }
    });
}


export const revokeTokens = async (id: any): Promise<any | null> => {
    console.log(2222222222, 'revokeTokens()', id)
    await db.refreshToken.delete({
        where: {
            id,
        },
    });
}


// export const revokeTokens = async (userId: any): Promise<any | null> => {
//     console.log(22, 'revokeTokens()', userId)
//     return db.refreshToken.updateMany({
//         where: {
//             userId
//         },
//         data: {
//             revoked: true
//         }
//     });
// }
