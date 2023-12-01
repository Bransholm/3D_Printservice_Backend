import { Router } from "express";
import dbConnection from "../../data-layer/data.js";
// import { Connection } from "mysql2/typings/mysql/lib/Connection.js";
const productsRouter = Router();

productsRouter.get("/", async (request, response) => {
  const queryString = /*sql*/ `SELECT * FROM products;`;
  const [result] = await dbConnection.execute(queryString);
  if (!result) {
    response
      .status(500)
      .json({ message: "An Internal Server Error Has Occured" });
  } else {
    response.json(result);
  }
});

// https://sehannrathnayake.medium.com/how-to-handle-mysql-database-transactions-with-nodejs-b7a2bf1fd203
const productAndOrder = (
  Catalogue_ID,
  Stock_ID,
  ProductSize,
  CalculatedPrice,
  Orders_ID,
  Products_ID
) => {
  return new Promise((resolve, reject) => {
    dbConnection.getConnection((err, connection) => {
      if (err) {
        return reject("Error occurred while getting the connection");
      }
      return connection.beginTransaction((err) => {
        if (err) {
          connection.release();
          return reject("Error occurred while creating the transaction");
        }
        return connection.execute(
          "INSERT INTO products (Catalogue_ID, Stock_ID, ProductSize, CalculatedPrice) VALUES (?,?,?,?)",
          [Catalogue_ID, Stock_ID, ProductSize, CalculatedPrice],
          (err) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                return reject("Inserting to products table failed", err);
              });
            }
            return connection.execute(
              "INSERT INTO orders_products (Orders_ID, Products_ID) VALUES (?,?)",
              [Orders_ID, Products_ID],
              (err) => {
                if (err) {
                  return connection.rollback(() => {
                    connection.release();
                    return reject("Inserting to orders_products table failed");
                  });
                }
                return connection.commit((err) => {
                  if (err) {
                    return connection.rollback(() => {
                      connection.release();
                      return reject("Commit failed");
                    });
                  }
                  connection.release();
                });
              }
            );
          }
        );
      });
    });
  });
};

// productAndOrder("2", "1", 4, 100, "1", "1");

export default productsRouter;
