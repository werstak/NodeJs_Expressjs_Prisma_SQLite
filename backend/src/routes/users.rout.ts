import express from "express";
import type { Request, Response } from "express";
import * as UserHandler from "../controllers/users.conroller";


export const usersRouter = express.Router();

/** GET: List of all USERS */
usersRouter.get("/", async (req: Request, res: Response) => {

    console.log('Root GET - USERS')
    try {
      const users = await UserHandler.getUserHandler();
      return res.status(200).json(users);
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

