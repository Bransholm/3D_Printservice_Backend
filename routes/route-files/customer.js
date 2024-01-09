import { Router, response } from "express";
import dbConnection from "../../data-layer/data.js";

const customersRouter = Router();

// Reads the catalogue data
customersRouter.get("/", async (request, response) => {
  try {
    const queryString = /*sql*/ `SELECT Email FROM Customers`;
    const [result] = await dbConnection.execute(queryString);
    response.json(result);
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ message: "An Internal Server Error Has Occured" });
  }
});

// Hvad med error handling?
customersRouter.get("/:email", async (request, response) => {
  try {
    const email = request.params.email;
    const queryString = /*sql*/ `SELECT * FROM Customers WHERE Email = ? `;
    const values = [email];
    const [result] = await dbConnection.execute(queryString, values);
    response.json(result);
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ message: "An Internal Server Error Has Occured" });
  }
});

export default customersRouter;
