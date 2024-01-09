import { Router, response } from "express";
import dbConnection from "../../data-layer/data.js";

const viewOrdrerRouter = Router();

//Get router for view orders
viewOrdrerRouter.get("/", async (request, response) => {
  try {
      const queryString =
        /*sql*/
        `
        SELECT * from orders
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

export default viewOrdrerRouter;