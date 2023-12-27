import { Router, response } from "express";
import dbConnection from "../../data-layer/data.js";

const customerRouter = Router();


// Hvad med error handling?
customerRouter.get("/", async (request, response) => {
  try {
    const email = request.query.email;
    const queryString = /*sql*/ `SELECT * FROM customer WHERE email = ${email};`;
    const [result] = await dbConnection.execute(queryString);
    response.json(result);
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ message: "An Internal Server Error Has Occured" });
  }
});

export default customerRouter;