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
} from "../router-error-handling/router-error-response.js";

import {
  readAllStockItemsQuery,
  createStockItemQuery,
  readStockItemByIdQuery,
  deleteStockItemByIdQuery,
} from "../query-files/stock-queries.js";

const stockRouter = Router();

// CREATE a new catalogue Ites
stockRouter.post("/", async (request, response) => {
  try {
    const result = await createStockItemQuery(request);
    response.json(result);
  } catch (error) {
    InternalServerErrorResponse(error, response);
  }
});

// Reads the catalogue data
stockRouter.get("/", async (request, response) => {
  try {
    const result = await readAllStockItemsQuery();
    response.json(result);
  } catch (error) {
    InternalServerErrorResponse(error, response);
  }
});

// Get catalogue item by ID
stockRouter.get("/:id", async (request, response) => {
  const id = request.params.id;
  try {
    const result = await readStockItemByIdQuery(id, request);
    if (result.length === 0) {
      rowIdNotFoundResponse(id, response);
    } else {
      response.json(result[0]);
    }
  } catch (error) {
    console.log(InternalServerErrorResponse(error, response));
    InternalServerErrorResponse(error, response);
  }
});


async function updateStockItemQuery(id, request) {
  const body = request.body;
  // Update query
  const queryString =
    /*sql*/
    `UPDATE stock SET Name=?, Material=?, Colour=?, GramInStock=?, Active=?, SalesPrice=? WHERE Id=?`;
  const values = [
    body.name,
    body.material,
    body.colour,
    body.gramInStock,
    body.active,
    body.salesPrice,
    id,
  ];

  // Execute the update query within the transaction
  const [result] = await dbConnection.query(queryString, values);
  return result;
}


// UPDATE specific catalogue itme
stockRouter.put("/:id", async (request, response) => {
  const id = request.params.id;
  console.log("put route id: ", id)

  let result;
  try {
    // Start a transaction
    await dbConnection.beginTransaction();

    try {
      result = await updateStockItemQuery(id, request);

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
stockRouter.delete("/:id", async (request, response) => {
  const id = request.params.id;
  let result;
  try {
    result = await deleteStockItemByIdQuery(id, request);
    if (result.affectedRows === 0) {
      rowIdNotFoundResponse(id, response);
    } else {
      successFullDeleteResponse(id, response);
    }
  } catch (error) {
    InternalServerErrorResponse(error, response);
  }
});

export default stockRouter;
