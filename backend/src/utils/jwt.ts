import jwt from 'jsonwebtoken';



export function generateAccessToken (user: any) {
    const accessSecret = process.env.JWT_ACCESS_SECRET as string;
    return jwt.sign({ userId: user.id }, accessSecret, {
        expiresIn: '20m',
    });
}

export function generateRefreshToken (user: any, jti: any) {
    const refreshSecret = process.env.JWT_REFRESH_SECRET as string;
    return jwt.sign({
        userId: user.id,
        jti
    }, refreshSecret, {
        expiresIn: '4h',
    });
}

export function generateTokens (user: any, jti: any){
    console.log(555555, 'generateTokens')
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user, jti);
    return {
        accessToken,
        refreshToken,
    };
}




//
// export const generateAccessToken = async (user: any): Promise<any | null> => {
//     const accessSecret = process.env.JWT_ACCESS_SECRET as string;
//     return jwt.sign({ userId: user.id }, accessSecret, {
//         expiresIn: '5m',
//     });
// }
//
// export const generateRefreshToken = async (user: any, jti: any): Promise<any | null> =>{
//     const refreshSecret = process.env.JWT_REFRESH_SECRET as string;
//     return jwt.sign({
//         userId: user.id,
//         jti
//     }, refreshSecret, {
//         expiresIn: '4h',
//     });
// }
//
// export const generateTokens = async (user: any, jti: any): Promise<any | null> =>{
//     const accessToken = generateAccessToken(user);
//     const refreshToken = generateRefreshToken(user, jti);
//     return {
//         accessToken,
//         refreshToken,
//     };
// }

