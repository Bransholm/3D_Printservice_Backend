import { Router, response } from "express";

// Import error handling functions:
import { InternalServerErrorResponse } from "../router-error-handling/router-error-response.js";
// Import SQL-queries:

import { readAvailavleStockItemsQuery } from "../query-files/stock-queries.js";

const avialableStockRouter = Router();

// Reads the catalogue data
avialableStockRouter.get("/", async (request, response) => {
  try {
    const result = await readAvailavleStockItemsQuery();
    response.json(result);
  } catch (error) {
    InternalServerErrorResponse(error, response);
  }
});
export default avialableStockRouter;
