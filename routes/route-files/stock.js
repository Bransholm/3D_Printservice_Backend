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

// UPDATE specific catalogue itme
stockRouter.put("/:id", async (request, response) => {
  await dbConnection.beginTransaction();

  const body = request.body;
  const id = request.params.id;

  try{
  const stockUpdateResult = await updateStockItemQuery(body,id);
  if(!stockUpdateResult || stockUpdateResult.affectedRows === 0){
    rowIdNotFoundResponse(id, response)
  } 
  // else {
  //   response.json(stockUpdateResult[0]);
  // }
  response.json({message: " A stock material has sucessfully ben updated" });
  await dbConnection.commit();

  }catch (error){
   console.error(error);
   await dbConnection.rollback();
   response.status(500).json({message: "An Internal Server Error Has Occured"})
  }

});

async function updateStockItemQuery(stock, id) {
  console.log("Query request: ", stock);
  const queryString =
    /*sql*/
    `UPDATE  Stock SET Name=?, Material = ?,  Colour = ? , GramInStock  = ? , Active = ?, SalesPrice = ? WHERE Id = ?;`;
  
    const updateValues = [
    stock.name,
    stock.material,
    stock.colour,
    stock.gramInStock,
    stock.active,
    stock.salesPrice,
    id,
  ];

  /* DO WE USE QUERY OR EXECUTE */
  const [result] = await dbConnection.execute(queryString, updateValues);
  return result;
}


// // updates a row in the Customers table
// customersRouter.put("/:id", async (request, response) => {
//   await dbConnection.beginTransaction();

//   const body = request.body;
//   const id = request.params.id;
//   console.log(body);
//   try {
//     const customerResult = await updateCustomer(body, id);
//     if (!customerResult || customerResult.affectedRows === 0) {
//       rowIdNotFoundResponse(id, response);
//     }
//     //else {
//     //   response.json(customerResult[0]);
//     // }
//     response.json({ message: " A customer has sucessfully ben updated" });
//     await dbConnection.commit();
//   } catch (error) {
//     console.error(error);
//     await dbConnection.rollback();

//     response
//       .status(500)
//       .json({ message: "An Internal Server Error Has Occured" });
//   }
// });


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
