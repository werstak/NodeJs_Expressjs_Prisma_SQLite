import express from 'express';
import type { Request, Response } from 'express';
import * as RootHandler from '../controllers/root.controller';
import { getPostCountsHandler } from '../controllers/root.controller';


export const rootRouter = express.Router();

console.log('Root - ROUTS')

// rootRouter.get('/', async (request: Request, response: Response) => {
//     try {
//         const root = await RootHandler.getRootHandler();
//         return response.status(200).json(root);
//     } catch (error: any) {
//         return response.status(500).json(error.message);
//     }
// });


/**
 * GET: Get post counts
 */
rootRouter.get('/', async (request: Request, response: Response) => {
    console.log(88888888,'Root GET - Get post counts');
    try {
        const counts = await RootHandler.getPostCountsHandler();
        return response.status(200).json(counts);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});
