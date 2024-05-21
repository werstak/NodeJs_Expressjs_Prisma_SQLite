import express from 'express';
import type { Request, Response } from 'express';
import * as RootHandler from '../controllers/root.controller';
import { PostCountResponse } from '../models';


export const rootRouter = express.Router();


/**
 * GET: Get post counts by various criteria.
 * @returns An object containing counts by total, role, user, category, and status.
 */
rootRouter.get('/', async (request: Request, response: Response) => {
    try {
        const counts: PostCountResponse = await RootHandler.getPostCountsHandler();
        return response.status(200).json(counts);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});
