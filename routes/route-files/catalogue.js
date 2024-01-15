import { Router, response } from "express";
import dbConnection from "../../data-layer/data.js";
import Debug from "debug";

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

// Get Catalogue router that works with filter and search
catalogueRouter.get("/", async (request, response) => {
  try {
    const filter = request.query.filter;
    const search = request.query.search;
    let queryString = "";

    console.log(filter);

    if (filter === "all") {
      if (search === "") {
        queryString = /*sql*/ `SELECT * FROM catalogue;`;
      } else if (search !== "") {
        queryString = /*sql*/ `SELECT * FROM catalogue where Title LIKE '%${search}%';`;
      }
    } else if (filter === "Bygninger" || filter === "Dyr" || filter === "Eventyr" || filter === "Sci-fi") {
  if (search === "") {
    queryString = /*sql*/ `SELECT * FROM catalogue where Category = '${filter}';`;
  } else if (search !== "") {
    queryString = /*sql*/ `SELECT * FROM catalogue where Category = '${filter}' AND Title LIKE '%${search}%';`;
  }
}
 else {
      queryString = /*sql*/ `SELECT * FROM catalogue;`;
    }

    const [result] = await dbConnection.execute(queryString);
    response.json(result);
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ message: "An Internal Server Error Has Occured" });
  }
});

// Get Catalogue router that works with filter and search
// catalogueRouter.get("/", async (request, response) => {
//   try {
//     const filter = request.query.filter;
//     const search = request.query.search;
//     let queryString = "";

//     if (filter === "all") {
//       if (search === "") {
//         queryString = /*sql*/ `SELECT * FROM catalogue;`;
//       } else if (search !== "") {
//         queryString = /*sql*/ `SELECT * FROM catalogue where Title LIKE '%${search}%';`;
//       }
//     } else if (filter === "Bygninger") {
//       if (search === "") {
//         queryString = /*sql*/ `SELECT * FROM catalogue where Category = "Bygninger";`;
//       } else if (search !== "") {
//         queryString = /*sql*/ `SELECT * FROM catalogue where Category = "Bygninger" AND Title LIKE '%${search}%';`;
//       }
//     } else if (filter === "Dyr") {
//       if (search === "") {
//         queryString = /*sql*/ `SELECT * FROM catalogue where Category = "Dyr";`;
//       } else if (search !== "") {
//         queryString = /*sql*/ `SELECT * FROM catalogue where Category = "Dyr" AND Title LIKE '%${search}%';`;
//       }
//     } else if (filter === "Eventyr") {
//       if (search === "") {
//         queryString = /*sql*/ `SELECT * FROM catalogue where Category = "Eventyr";`;
//       } else if (search !== "") {
//         queryString = /*sql*/ `SELECT * FROM catalogue where Category = "Eventyr" AND Title LIKE '%${search}%';`;
//       }
//     } else if (filter === "Sci-fi") {
//       if (search === "") {
//         queryString = /*sql*/ `SELECT * FROM catalogue where Category = "Sci-fi";`;
//       } else if (search !== "") {
//         queryString = /*sql*/ `SELECT * FROM catalogue where Category = "Sci-fi" AND Title LIKE '%${search}%';`;
//       }
//     } else {
//       queryString = /*sql*/ `SELECT * FROM catalogue;`;
//     }

//     const [result] = await dbConnection.execute(queryString);
//     response.json(result);
//   } catch (error) {
//     console.error(error);
//     response
//       .status(500)
//       .json({ message: "An Internal Server Error Has Occured" });
//   }
// });

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

export default catalogueRouter;
