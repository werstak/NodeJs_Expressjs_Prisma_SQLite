import express from "express";
import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import * as UserHandler from "../controllers/users.conroller";


export const usersRouter = express.Router();

/** GET: List of all USERS */
usersRouter.get("/", async (req: Request, res: Response) => {

    console.log('Root GET - All USERS')
    try {
      const users = await UserHandler.getAllUsersHandler();
      return res.status(200).json(users);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  });


/** GET: A single USER by ID */
usersRouter.get("/:id", async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);

    console.log('Root GET - single USER')
    try {
        const user = await UserHandler.getUserHandler(id);
        if (user) {
            return response.status(200).json(user);
        }
        return response.status(404).json("User could not be found");
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});


/** POST: Create a User */
usersRouter.post(
    "/",
    body("firstName").isString(),
    body("lastName").isString(),
    async (request: Request, response: Response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({ errors: errors.array() });
        }
        try {
            console.log('Root POST - create USER = ', request.body)

            const user = request.body;
            const newUser = await UserHandler.createUserHandler(user);
            return response.status(201).json(newUser);
        } catch (error: any) {
            return response.status(500).json(error.message);
        }
    }
);


/** PUT: Updating an USER */
usersRouter.put(
    "/:id",
    body("firstName").isString(),
    body("lastName").isString(),
    body("email").isString(),
    async (request: Request, response: Response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({ errors: errors.array() });
        }
        const id: number = parseInt(request.params.id, 10);
        try {
            console.log('Root PUT - Updating USER = ', request.body)

            const user = request.body;
            const updatedUser = await UserHandler.updateUserHandler(user, id);
            return response.status(200).json(updatedUser);
        } catch (error: any) {
            return response.status(500).json(error.message);
        }
    }
);


/**DELETE: Delete an USER based on the ID*/
usersRouter.delete("/:id", async (request: Request, response: Response) => {
    const id: number = parseInt(request.params.id, 10);
    try {
        console.log('Root DELETE - POST = ', request.body)

        await UserHandler.deleteUserHandler(id);
        return response.status(204).json("User has been successfully deleted");
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
});
