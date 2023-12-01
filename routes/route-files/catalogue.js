import { Router, response } from "express";
import dbConnection from "../../data-layer/data.js";
// import { request } from "http";
// import { error } from "console";
// import { Connection } from "mysql2/typings/mysql/lib/Connection.js";

// Import error handling functions:
import {
  InternalServerErrorResponse,
  rowIdNotFoundResponse,
  successFullDeleteResponse,
} from "../router-error-handling/routerErrorResponse.js";
// Import SQL-queries:

const catalogueRouter = Router();


// QUERY-STRING + db.execute
async function getCatalougeReadQuery() {
  const queryString = /*sql*/ `SELECT * FROM catalogue;`;
  const [result] = await dbConnection.execute(queryString);
  return result;
}

// Reads the catalogue data
catalogueRouter.get("/", async (request, response) => {
  try {
    const result = await getCatalougeReadQuery();
    response.json(result);
  } catch (error) {
    InternalServerErrorResponse(error, response);
  }
});

// Create catalog item
async function getCatalogueCreateQuery(request) {
  const body = request.body;
  const queryString =
    "INSERT INTO catalogue (Title, StandardSize, StandardWeight, ItemDescription, ImageLink, Category) VALUES (?, ?, ?, ?, ?, ?);";
  const values = [
    body.Title,
    body.StandardSize,
    body.StandardWeight,
    body.ItemDescription,
    body.ImageLink,
    body.Category,
  ];

  const result = await dbConnection.execute(queryString, values);
  return result;
}

// Get catalog item by ID
async function getCatalogReadByIDQuery(id, request) {
  const queryString = "SELECT * FROM catalogue WHERE id = ?";
  const values = [id];

  const [result] = await dbConnection.execute(queryString, values);
  console.log("Result is: ", result);
  return result;
}

// Delete catalogue item by ID
async function deleteCatalogueByIdQuery(id, request) {
  const values = [id];
  // Delete the given item from the catalogue
  const queryString = "DELETE FROM catalogue WHERE id=?";
  const [result] = await dbConnection.query(queryString, values);
  return result;
}

// CREATE all catalogue Items
catalogueRouter.post("/", async (request, response) => {
  try {
    const result = await getCatalogueCreateQuery(request);
    response.json(result);
  } catch (error) {
    InternalServerErrorResponse(error, response);
  }
});

// Get catalogue item by ID
catalogueRouter.get("/:id", async (request, response) => {
  const id = request.params.id;
  try {
    const result = await getCatalogReadByIDQuery(id, request);
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

// DO WE NEED FILTER TABS...

// Update catalog item by ID
async function updateCatalogueQuery(id, request) {
  const body = request.body;
  // Update query
  const updateQuery =
    "UPDATE catalogue SET Title=?, StandardSize=?, StandardWeight=?, ItemDescription=?, ImageLink=?, Category=? WHERE id=?;";
  const updateValues = [
    body.Title,
    body.StandardSize,
    body.StandardWeight,
    body.ItemDescription,
    body.ImageLink,
    body.Category,
    id,
  ];

  // Execute the update query within the transaction
  const [result] = await dbConnection.query(updateQuery, updateValues);
  return result;
}

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

export default catalogueRouter;
