import { Router, response } from "express";
import dbConnection from "../data-layer/data.js";
import { request } from "http";
// import { Connection } from "mysql2/typings/mysql/lib/Connection.js";
const catalogueRouter = Router();

// Reads the catalogue data
catalogueRouter.get("/", async (request, response) => {
  const queryString = /*sql*/ `SELECT * FROM catalogue;`;
  const [result] = await dbConnection.execute(queryString);
  if (!result) {
    response
      .status(500)
      .json({ message: "An Internal Server Error Has Occured" });
  } else {
    response.json(result);
  }
});

//...
// CREATE artist
catalogueRouter.post("/", async (request, response) => {
  try {
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
    response.json(result);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

// ...
catalogueRouter.get("/:id", async (request, response) => {
  try {
    const id = request.params.id;
    const queryString = "SELECT * FROM catalogue WHERE id = ?";
    const values = [id];

    const [result] = await dbConnection.execute(queryString, values);

    if (result.length === 0) {
      response
        .status(404)
        .json({ error: `The artist with the id ${id} does not exist` });
    } else {
      response.json(result[0]);
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

// UPDATE specific catalogue itme
catalogueRouter.put("/:id", async (request, response) => {
  const id = request.params.id;
  const body = request.body;

  try {
    // Start a transaction
    await dbConnection.beginTransaction();

    try {
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
      const [updateResult] = await dbConnection.query(
        updateQuery,
        updateValues
      );

      // Commit the transaction if the update is successful
      await dbConnection.commit();

      response.json(updateResult);
    } catch (error) {
      // Rollback the transaction if there's an error
      await dbConnection.rollback();
      console.error(error);
      response.status(500).json({ error: "Internal Server Error" });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE item from Catalogue
catalogueRouter.delete("/:id", async (request, response) => {
  const id = request.params.id;
  const values = [id];
  try {
    // Delete the given item from the catalogue
    const queryString = "DELETE FROM catalogue WHERE id=?";
    const [result] = await dbConnection.query(queryString, values);

    if (result.affectedRows === 0) {
      response
        .status(404)
        .json({ error: `The item with the id ${id} does not exist` });
    } else {
      response.json({ message: "Item deleted successfully" });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
});


export default catalogueRouter;
