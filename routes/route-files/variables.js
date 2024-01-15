import { Router, response } from "express";
import dbConnection from "../../data-layer/data.js";

const variablesRouter = Router();

//Get router for view orders
variablesRouter.get("/", async (request, response) => {
  try {
    const queryString =
      /*sql*/
      `
        SELECT * FROM variables
    `;
    const [result] = await dbConnection.execute(queryString);
    response.json(result);
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ message: "An Internal Server Error Has Occured" });
  }
});

export default variablesRouter;
