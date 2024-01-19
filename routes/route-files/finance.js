import { Router, response } from "express";
import dbConnection from "../../data-layer/data.js";

const financeRouter = Router();

//Get router for view orders
financeRouter.get("/", async (request, response) => {
  try {
    const startDate = request.query.startDate;
    const endDate = request.query.endDate;
    const queryString =
      /*sql*/
      `
        SELECT SUM(TotalPrice) AS CombinedPrice FROM orders
        WHERE Status IN ('paid', 'delivered')
        AND DATE(TimeDate) BETWEEN '${startDate}' AND '${endDate}';
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

export default financeRouter;
