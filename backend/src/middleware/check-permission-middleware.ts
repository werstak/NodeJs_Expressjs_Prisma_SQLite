// import { Request, Response, NextFunction } from 'express';
// import db from '../utils/db';
// import jwt, { JwtPayload } from 'jsonwebtoken';
// import { RoleTypesEnum } from '../enums/role-types.enum';

import Role from '../rbac-config/role';
import Permissions from '../rbac-config/permissions';
import { Request, Response, NextFunction } from 'express';



/**
 * Middleware to check if the user has one of the allowed roles.
 * @param allowedRoles - Array of roles that are allowed to access the route.
 * @returns Middleware function for Express.js.
 */




// Check if the user has the required permission for a route
export const checkPermission = (permission: any) => {
    return (req: Request, res: Response, next: NextFunction) => {


        // const userRole = !req.user ? 'anonymous' : req.user.role;
        // const userPermissions = new Permissions().getPermissionsByRoleName(userRole);
        //
        // if (userPermissions.includes(permission)) {
        //     return next();
        // } else {
        //     return res.status(403).json({ error: 'Access denied' });
        // }


    };
};






// export const checkPermissionMiddleware = (permissions: any) => {
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
//             return next();
//
//         } catch (error) {
//             return res.status(500).json({ message: 'Internal Server Error' });
//         }
//     };
// }






// export const checkPermissionMiddleware = (permissions: any) => {
//     return (req: Request, res: Response, next: NextFunction) => {
//         if (req.user && req.user.role) {
//             const rolePermissions = permissions[req.user.role];
//             if (rolePermissions) {
//                 const { url, method } = req;
//                 const pagePermissions = rolePermissions[url];
//                 if (pagePermissions) {
//                     const { [method]: permission } = pagePermissions;
//                     if (permission) {
//                         next();
//                     } else {
//                         res.status(403).send('Forbidden');
//                     }
//                 } else {
//                     res.status(404).send('Not found');
//                 }
//             } else {
//                 res.status(401).send('Unauthorized');
//             }
//         } else {
//             res.status(401).send('Unauthorized');
//         }
//     };
// }
