import express from "express";
import type { Request, Response } from "express";
import * as PostHandler from "../controllers/posts.conroller";


export const postsRouter = express.Router();

/** GET: List of all POSTS */
postsRouter.get("/", async (req: Request, res: Response) => {

    console.log('Root GET - POSTS')
    try {
        const posts = await PostHandler.getPostsHandler();
        return res.status(200).json(posts);
    } catch (error: any) {
        return res.status(500).json(error.message);
    }
});


//
// const getUsersHandler = (req, res) => {
//     res.send('Get users route');
// };
//
// const getSingleUserHandler = (req, res) => {
//     res.send(`Get user route. UserId ${req.params.userId}`);
// };
//
// const postUsersHandler = (req, res) => {
//     res.send('Post users route');
// };

