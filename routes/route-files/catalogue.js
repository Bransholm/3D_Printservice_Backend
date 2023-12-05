import { Router, response } from "express";
import dbConnection from "../../data-layer/data.js";
import Debug from "debug";
// import { request } from "http";
// import { error } from "console";
// import { Connection } from "mysql2/typings/mysql/lib/Connection.js";

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


const catalogueRouter = Router();



// CREATE all catalogue Items
catalogueRouter.post("/", async (request, response) => {
  try {
    const result = await createCatalogueItemQuery(request);
    response.json(result);
  } catch (error) {
    InternalServerErrorResponse(error, response);
  }
});


// Reads the catalogue data
catalogueRouter.get("/", async (request, response) => {
  try {
    const result = await readCatalougeQuery();
    response.json(result);
  } catch (error) {
    InternalServerErrorResponse(error, response);
  }
});


// Get catalogue item by ID
catalogueRouter.get("/:id", async (request, response) => {
  const id = request.params.id;
  try {
    const result = await readCatalogItemByIdQuery(id, request);
    if (result.length === 0) {
      rowIdNotFoundResponse(id, response);
    } else {
      response.json(result[0]);
    }
  } catch (error) {
    console.log(InternalServerErrorResponse(error,response))
    InternalServerErrorResponse(error, response);
  }
});

// UPDATE specific catalogue itme
catalogueRouter.put("/:id", async (request, response) => {
  const id = request.params.id;

  let result;
  try {
    // Start a transaction
    await dbConnection.beginTransaction();

    try {
      result = await updateCatalogueQuery(id, request);
      console.log(result);

      // Commit the transaction if the update is successful
      await dbConnection.commit();

      if (!result || result.affectedRows === 0) {
        rowIdNotFoundResponse(id, response);
      } else {
        response.json(result);
      }
    } catch (error) {
      // Rollback the transaction incase of an error
      await dbConnection.rollback();
      InternalServerErrorResponse(error, response);
    }
  } catch (error) {
    InternalServerErrorResponse(response, error);
  }
});

// DELETE item from Catalogue
catalogueRouter.delete("/:id", async (request, response) => {
  const id = request.params.id;
  let result;
  try {
    result = await deleteCatalogueByIdQuery(id, request);
    if (result.affectedRows === 0) {
      rowIdNotFoundResponse(id, response);
    } else {
      successFullDeleteResponse(id, response);
    }
  } catch (error) {
    InternalServerErrorResponse(error, response);
  }
});



catalogueRouter.get("/search", async (request, response) => {
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





export default catalogueRouter;
