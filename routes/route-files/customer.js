import { Router, response } from "express";
import dbConnection from "../../data-layer/data.js";

import {
  InternalServerErrorResponse,
  rowIdNotFoundResponse,
  successFullDeleteResponse,
} from "../router-error-handling/router-error-response.js";

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

// creates a new row in the Customers table
customersRouter.post("/", async (request, response) => {
  await dbConnection.beginTransaction();

  const body = request.body;
  console.log(body);
  try {
    const [customerResult] = await createCustomer(body);
    if (!customerResult) {
      console.error(error);
      response
        .status(500)
        .json({ message: "An Internal Server Error Has Occured" });
    }
    response.json({ message: " A customer has sucessfully ben created" });
    await dbConnection.commit();
  } catch (error) {
    console.error(error);
    await dbConnection.rollback();

    response
      .status(500)
      .json({ message: "An Internal Server Error Has Occured" });
  }
});

async function createCustomer(customer) {
  console.log("Query request: ", customer);
  const queryString =
    /*sql*/
    `INSERT INTO Customers (FirstName, LastName, Adress, City, ZipCode, Email) 
     VALUES (?, ?, ?, ?, ?, ?);`;
  const values = [
    customer.firstName,
    customer.lastName,
    customer.adress,
    customer.city,
    customer.zipCode,
    customer.email,
  ];

  /* DO WE USE QUERY OR EXECUTE */
  const result = await dbConnection.execute(queryString, values);
  return result;
}

// updates a row in the Customers table
customersRouter.put("/:id", async (request, response) => {
  await dbConnection.beginTransaction();

  const body = request.body;
  const id = request.params.id;
  console.log(body);
  try {
    const customerResult = await updateCustomer(body, id);
      if (!customerResult || customerResult.affectedRows === 0) {
        rowIdNotFoundResponse(id, response);
      }
    //else {
    //   response.json(customerResult[0]);
    // }
    response.json({ message: " A customer has sucessfully ben updated" });
    await dbConnection.commit();
  } catch (error) {
    console.error(error);
    await dbConnection.rollback();

    response
      .status(500)
      .json({ message: "An Internal Server Error Has Occured" });
  }
});

async function updateCustomer(customer, id) {
  console.log("Query request: ", customer);
  const queryString =
    /*sql*/
    `UPDATE Customers SET FirstName = ?, LastName = ?, Adress = ?, City = ?, ZipCode = ?, Email = ? WHERE Id = ?;`;
  const updateValues = [
    customer.firstName,
    customer.lastName,
    customer.adress,
    customer.city,
    customer.zipCode,
    customer.email,
    id,
  ];

  /* DO WE USE QUERY OR EXECUTE */
  const [result] = await dbConnection.execute(queryString, updateValues);
  return result;
}


export default customersRouter;
