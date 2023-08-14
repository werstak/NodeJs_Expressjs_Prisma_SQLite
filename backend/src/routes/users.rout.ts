import express from "express";
import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import * as UserHandler from "../controllers/users.conroller";


export const usersRouter = express.Router();

/** GET: List of all USERS */
usersRouter.get("/", async (request: Request, response: Response) => {

    console.log('Root GET - All USERS')
    try {
      const users = await UserHandler.getAllUsersHandler();
      return response.status(200).json(users);
    } catch (error: any) {
      return response.status(500).json(error.message);
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
    // body("firstName").isString(),
    // body("lastName").isString(),
    // body("email").isString(),
    async (request: Request, response: Response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({ errors: errors.array() });
        }
        const id: number = parseInt(request.params.id, 10);
        try {

            console.log('111 Root PUT - Updating USER = ', request)
            console.log('222 Root PUT - Updating USER = ', request.body)
            console.log('3333 PUT - Updating USER request = ', request.params)

            // const test = JSON.stringify(request.body.UserParams);

            // console.log('44444 test', test);
            // console.log(77777, JSON.stringify(request.body.user_params));



            const user = request.body;

            // const path = request.file.path.replace(/\\/g, "/");
            // await User.findByIdAndUpdate(id, req.body = {ProfilePicture: "http://localhost:5000/" + path}, { new: true });
            // res.json(updateAnUser);

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
