import { Router } from "express";
// import dbConnection from "../data-layer/data.js";
const startRouter = Router();

startRouter.get("/", (request, response) => {
  response.send("Welcome to 3dPrintservice.dk");
});

export default startRouter;
