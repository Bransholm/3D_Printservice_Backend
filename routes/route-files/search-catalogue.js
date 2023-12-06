import { Router, response } from "express";
import dbConnection from "../../data-layer/data.js";


// Import error handling functions:
import {
  InternalServerErrorResponse,
  rowIdNotFoundResponse,
  successFullDeleteResponse,
} from "../router-error-handling/router-error-response.js";
// Import SQL-queries:
import {
  readCatalougeQuery,
  createCatalogueItemQuery,
  readCatalogItemByIdQuery,
  updateCatalogueQuery,
  deleteCatalogueByIdQuery,
} from "../query-files/catalogue-quries.js";


const searchCatalogueRouter = Router();



searchCatalogueRouter.get("/", async (request, response) => {
  try {
    const searchType = request.query.type;
    const searchTerm = request.query.q;

    let query = "";
    let tableName = "";

    if (searchType === "Category") {
      query = "SELECT * from products WHERE Category LIKE ?";
      // Da vi skal have en search for hvert table, kan vi så slette denne variabel "tableName"? - Lukas
      tableName = "products";
    } else {
      return response.status(400).json({ error: "Invalid search type" });
    }

    const [rows] = await dbConnection.query(query, [`%${searchTerm}%`]);

    // Der behøver ikke være et tablename fordi vi overholder REST?? - Lukas
    response.json({ [tableName]: rows });
  } catch (error) {
    console.error("There was an error when attempting to search", error);
    response.status(500).json({ error: "An error occurred while searching" });
  }
});

export default searchCatalogueRouter;
