import { Request, Response, NextFunction } from 'express';
import db from '../utils/db';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { RoleTypesEnum } from '../enums/role-types.enum';

/**
 * Middleware to check if the user has one of the allowed roles.
 * @param allowedRoles - Array of roles that are allowed to access the route.
 * @returns Middleware function for Express.js.
 */
export const allowedRoleMiddleware = (allowedRoles: RoleTypesEnum[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        try {
            const token = authorization.split(' ')[1];
            const decodeToken = jwt.decode(token) as JwtPayload;
            const userId = decodeToken.userId;

            // Fetch the user's role from the database
            const userRole: { role: number } | null = await db.user.findUnique({
                where: { id: userId },
                select: { role: true }
            });

            // If user's role is not found or not in the allowed roles, respond with 403 Forbidden
            if (!userRole?.role || !allowedRoles.includes(userRole.role)) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            return next();

        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };
};




// import { Request, Response, NextFunction } from 'express';
// import db from '../utils/db';
// import jwt, { JwtPayload } from 'jsonwebtoken';
// import { RoleTypesEnum } from '../enums/role-types.enum';
//
// /**
//  * Middleware to check if the user has one of the allowed roles and meets custom criteria.
//  * @param allowedRoles - Array of roles that are allowed to access the route.
//  * @returns Middleware function for Express.js.
//  */
// export const allowedRoleMiddleware = (allowedRoles: RoleTypesEnum[]) => {
//     return async (req: Request, res: Response, next: NextFunction) => {
//         const { authorization } = req.headers;
//
//         if (!authorization) {
//             return res.status(401).json({ message: 'Unauthorized' });
//         }
//
//         try {
//             const token = authorization.split(' ')[1];
//             const decodeToken = jwt.decode(token) as JwtPayload;
//             const userId = decodeToken.userId;
//
//             // Fetch the user's role from the database
//             const userRole: { role: number } | null = await db.user.findUnique({
//                 where: { id: userId },
//                 select: { role: true }
//             });
//
//             // If user's role is not found or not in the allowed roles, respond with 403 Forbidden
//             if (!userRole?.role || !allowedRoles.includes(userRole.role)) {
//                 return res.status(403).json({ message: 'Forbidden' });
//             }
//
//             // Additional check for Client role
//             if (userRole.role === RoleTypesEnum.Client) {
//                 const authors = Array.isArray(req.query.authors) ? req.query.authors : [req.query.authors];
//
//                 console.log('authors', authors);
//                 if (!authors || !authors.length || !authors.includes(userId)) {
//                     return res.status(403).json({ message: 'Forbidden' });
//                 }
//             }
//
//             return next();
//         } catch (error) {
//             return res.status(500).json({ message: 'Internal Server Error' });
//         }
//     };
// };
