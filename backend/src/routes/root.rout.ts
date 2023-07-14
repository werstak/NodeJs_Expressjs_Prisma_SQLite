import express from 'express';
import type { Request, Response } from 'express';
import * as RootHandler from '../controllers/root.conroller';


export const rootRouter = express.Router();

console.log('Root - ROUTS')

rootRouter.get('/', async (req: Request, res: Response) => {
    try {
        const root = await RootHandler.getRootHandler();
        return res.status(200).json(root);
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
});
