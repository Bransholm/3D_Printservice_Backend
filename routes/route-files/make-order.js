import { Router, response } from "express";
import dbConnection from "../../data-layer/data.js";

const makeOrderRouter = Router();

import { InternalServerErrorResponse } from "../router-error-handling/router-error-response.js";
import { readAllStockItemsQuery } from "../query-files/stock-queries.js";
const connection = dbConnection;

// Reads the catalogue data
makeOrderRouter.get("/", async (request, response) => {
  try {
    const result = await readAllStockItemsQuery();
    response.json(result);
  } catch (error) {
    InternalServerErrorResponse(error, response);
  }
});

makeOrderRouter.post("/", async (request, response) => {
  let result;
  //response.json(result);

  await connection.beginTransaction();

  try {
    const body = request.body;
    const products = body.Order_Lines;
    const customer = body.CustomerInfo;
    const order = body.OdrderInfo;
    //SQL - make the Customer + Order
    // LOOP on all product-lines...


    const [customerResult] = await createCustomer(customer);
    const customerId = customerResult.insertId;
   
    if(!customerResult){
      console.error(error);
      response
        .status(500)
        .json({ message: "An Internal Server Error Has Occured - customerResult" }); 
     }else {
      response.json(customerResult);
    const [orderResult] = await createOrder(order, customerId);
    const orderId = orderResult.insertId;
    if(!orderResult){
       console.error(error);
      response
        .status(500)
        .json({ message: "An Internal Server Error Has Occured - orderResult" }); 
 
   } else {
      response.json(orderResult);
      for (const product of products) {
        const [productResult] = await createOrderLine(product, orderId);
            if(!productResult){
               console.error(error);
              response.status(500).json({ message: "An Internal Server Error Has Occured - productResult" }); 
            } else {
              response.json(product);
            }
          }
   }
    await connection.commit();
    // if (!orderResult || !customerResult ) {
    //   console.error(error);
    //   response
    //     .status(500)
    //     .json({ message: "An Internal Server Error Has Occured" });
    // } else {
    //   response.json(result);
    // }1
     }
  } catch (error) {
    console.error(error);

    await connection.rollback();

    response
      .status(500)
      .json({ message: "An Internal Server Error Has Occured" });
  }
});

async function createOrderLine(product, orderId) {
  console.log("Query request: ", product);
  const queryString =
    /*SQL*/
    `INSERT INTO Order_Lines (Orders_ID, Catalogue_ID, Amount, ProductSize, ItemPrice, ItemTax, Stock_ID) 
     VALUES (?, ?, ?, ?, ?, ?, ?);`;
  const values = [
    orderId,
    product.catalogue_ID,
    product.amount,
    product.productSize,
    product.itemPrice,
    product.itemTax,
    product.stock_ID,
  ];

  const result = await connection.execute(queryString, values);
  return result;
}

async function createOrder(order, customerId) {
  console.log(order);
  const queryString =
    /*sql*/
    `INSERT INTO Orders (customer_ID, Status, DeliveryAdress, DeliveryZipCode, DeliveryCity, TotalTax, TotalPrice, ShippingPrice) 
     VALUES ( ?, ?, ?, ?, ?, ?, ?, ?);`;
  const values = [
    customerId,
    order.status,
    order.deliveryAdress,
    order.deliveryZipCode,
    order.deliveryCity,
    order.totalTax,
    order.totalPrice,
    order.shippingPrice,
  ];

  const result = await connection.execute(queryString, values);
  return result;
}

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

  const result = await connection.execute(queryString, values);
  return result;
}

export default makeOrderRouter;
