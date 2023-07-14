import express from "express";
import type { Request, Response } from "express";
import * as RootHandler from "../controllers/root";
// const express = require('express');
// const { getRootHandler } = require('../controllers/root');

export const rootRouter = express.Router();

console.log('Root - ROUTS')

// rootRouter.use('/', getRootHandler);


rootRouter.get("/", async (req: Request, res: Response) => {
    try {
      const test = await RootHandler.getRootHandler();
      return res.status(200).json(test);
    } catch (error: any) {
      return res.status(500).json(error.message);
    }
  });


//   authorRouter.get("/", async (request: Request, response: Response) => {
//     try {
//       const authors = await AuthorService.listAuthors();
//       return response.status(200).json(authors);
//     } catch (error: any) {
//       return response.status(500).json(error.message);
//     }
//   });



// const router = express.Router();

// router.get('/', getRootHandler);




// module.exports = router;



// const express = require('express');
// const { getRootHandler } = require('../controllers/root');

// const router = express.Router();

// router.get('/', getRootHandler);

// module.exports = router;