import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';


export function notFound(request: Request, response: Response, next: any) {
    response.status(404);
    const error = new Error(`🔍 - Not Found - ${request.originalUrl}`);
    next(error);
}

/* eslint-disable no-unused-vars */
export function errorHandler(err: any, request: Request, response: Response, next: any) {
    /* eslint-enable no-unused-vars */
    const statusCode = response.statusCode !== 200 ? response.statusCode : 500;
    response.status(statusCode);
    response.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
    });
}

export function isAuthenticated(request: any, response: Response, next: any) {
    const { authorization } = request.headers;

    if (!authorization) {
        response.status(401);
        throw new Error('🚫 Un-Authorized 🚫');
    }

    try {
        const token = authorization.split(' ')[1];
        request.payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
        console.log(1111111, 'isAuthenticated')

    } catch (err: any) {
        response.status(401);
        if (err.name === 'TokenExpiredError') {
            throw new Error(err.name);
        }
        throw new Error('🚫 Un-Authorized 🚫');
    }

    return next();
}
