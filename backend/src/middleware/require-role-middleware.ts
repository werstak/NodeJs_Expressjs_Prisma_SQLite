import { Request, Response, NextFunction } from 'express';
// import { User, Role } from '@prisma/client';
import db from '../utils/db';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const requireRoleMiddleware = (roles: any[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {

        // console.log(111, 'req', req.headers)

        const { authorization } = req.headers; // Get authorization header from request

        if (!authorization) {
            res.status(401); // Set status code to 401 (Unauthorized)
            throw new Error('🚫 Un-Authorized 🚫'); // Throw error if authorization header is missing
        }

        const token = authorization.split(' ')[1]; // Extract token from authorization header
        const decodeToken = jwt.decode(token) as JwtPayload;
        const userId = decodeToken.userId;
        const userRole = await db.user.findUnique({
            where: { id: userId },
            select: {
                role: true,
            }
        });

        console.log(222, 'userRole', userRole)
        console.log(333, 'roles', roles)

            // req.payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);



        // const {refreshToken} = req.body;
        // if (!refreshToken) {
        //     return res.status(400).json({message: `Missing refresh token.`})
        // }
        // const payload: JwtPayload | any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string);
        // console.log(222, 'payload', payload)

        // const userId = req.userId; // Assuming userId is added to the request object after authentication
        // if (!userId) {
        //     return res.status(403).json({ message: 'Forbidden' });
        // }

        try {

            // const user: User | null = await db.user.findUnique({
            //     where: { id: userId },
            //     include: { role: true },
            // });
            //
            // if (!user || !roles.includes(user.role.name)) {
            //     return res.status(403).json({ message: 'Forbidden' });
            // }
            return next();

            // next();
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };
};
