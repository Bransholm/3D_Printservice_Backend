import { Router, response } from "express";
import dbConnection from "../../data-layer/data.js";

const makeOrderRouter = Router();

import { InternalServerErrorResponse } from "../router-error-handling/router-error-response.js";
import { readAllStockItemsQuery } from "../query-files/stock-queries.js";
const connection = dbConnection;

const order = {
  CustomerInfo: {
    firstName: "Jovan",
    lastName: "Pasovski",
    adress: "Molen 81",
    zipCode: "3390",
    city: "Hundested",
    email: "JovanPasovski@gmail.uk",
  },
  OdrderInfo: {
    status: "ordered",
    deliveryAdress: "Molen 81",
    deliveryZipCode: "3390",
    deliveryCity: "Hundested",
    totalTax: 260.0,
    totalPrice: 640.0,
    shippingPrice: 40.0,
  },
  Order_Lines: [
    {
      catalogue_ID: 11,
      amount: 3,
      productSize: 2,
      itemPrice: 400.0,
      itemTax: 45.0,
      stock_ID: 3,
    },
    {
      catalogue_ID: 14,
      amount: 1,
      productSize: 10,
      itemPrice: 100.0,
      itemTax: 22.0,
      stock_ID: 12,
    },
  ],
};

const orderJSON ={
  "CustomerInfo": {
    "firstName": "Jovan",
    "lastName": "Pasovski",
    "adress": "Molen 81",
    "zipCode": "3390",
    "city": "Hundested",
    "email": "JovanPasovski@gmail.uk"
  },
  "OdrderInfo": {
    "status": "ordered",
    "deliveryAdress": "Molen 81",
    "deliveryZipCode": "3390",
    "deliveryCity": "Hundested",
    "totalTax": 260.0,
    "totalPrice": 640.0,
    "shippingPrice": 40.0
  },
  "Order_Lines": [
    {
      "catalogue_ID": 11,
      "amount": 3,
      "productSize": 2,
      "itemPrice": 400.0,
      "itemTax": 45.0,
      "stock_ID": 3
    },
    {
      "catalogue_ID": 14,
      "amount": 1,
      "productSize": 10,
      "itemPrice": 100.0,
      "itemTax": 22.0,
      "stock_ID": 12
    }
  ]
};


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

    /* VI SKAL HAVE CUSTOMER-ID'et OG vi skal SENDE DET MED. Hvordan... */
    // const customerID = customer.id;

    if (!customerResult) {
      console.error(error);
      response.status(500).json({
        message: "An Internal Server Error Has Occured - customerResult",
      });
    } else {
      // response.json(customerResult);
      const [orderResult] = await createOrder(order, customerId);
      const orderId = orderResult.insertId;
      if (!orderResult) {
        console.error(error);
        response.status(500).json({
          message: "An Internal Server Error Has Occured - orderResult",
        });
      } else {
        // response.json(orderResult);
        for (const product of products) {
          const [productResult] = await createOrderLine(product, orderId);
          if (!productResult) {
            console.error(error);
            response.status(500).json({
              message: "An Internal Server Error Has Occured - productResult",
            });
            break;
          }
        }
      }
      await connection.commit();
      response.json({ message: " An oder has sucessfully ben created" });
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
