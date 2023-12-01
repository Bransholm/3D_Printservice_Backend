import { Router } from "express";
import dbConnection from "../../data-layer/data.js";
// import { Connection } from "mysql2/typings/mysql/lib/Connection.js";
const productsRouter = Router();

productsRouter.get("/", async (request, response) => {
  const queryString = /*sql*/ `SELECT * FROM products;`;
  const [result] = await dbConnection.execute(queryString);
  if (!result) {
    response
      .status(500)
      .json({ message: "An Internal Server Error Has Occured" });
  } else {
    response.json(result);
  }
});

export default productsRouter;
