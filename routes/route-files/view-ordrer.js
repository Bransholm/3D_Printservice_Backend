import { Router, response } from "express";
import dbConnection from "../../data-layer/data.js";

const viewOrdrerRouter = Router();

//Get router for view orders
viewOrdrerRouter.get("/", async (request, response) => {
  try {
      const queryString =
        /*sql*/
    `
        SELECT
        order_lines.Id AS order_lines_Id,
        order_lines.Orders_ID AS order_lines_Orders_ID,
        order_lines.Catalogue_ID AS order_lines_Catalogue_ID,
        order_lines.Amount AS order_lines_Amount,
        order_lines.ProductSize AS order_lines_ProductSize,
        order_lines.ItemPrice AS order_lines_ItemPrice,
        order_lines.ItemTax AS order_lines_ItemTax,
        order_lines.Stock_ID AS order_lines_Stock_ID,
        orders.customer_ID AS orders_customer_ID,
        orders.Status AS orders_Status,
        orders.TimeDate AS orders_TimeDate,
        orders.DeliveryAdress AS orders_DeliveryAdress,
        orders.DeliveryZipCode AS orders_DeliveryZipCode,
        orders.DeliveryCity AS orders_DeliveryCity,
        orders.TotalTax AS orders_TotalTax,
        orders.TotalPrice AS orders_TotalPrice,
        orders.ShippingPrice AS orders_ShippingPrice,
        customers.FirstName AS customers_FirstName,
        customers.LastName AS customers_LastName,
        customers.Adress AS customers_Adress,
        customers.City AS customers_City,
        customers.ZipCode AS customers_ZipCode,
        customers.Email AS customers_Email,
        catalogue.Title AS catalogue_Title,
        stock.Name AS stock_Name,
        stock.Material AS stock_Material,
        stock.Colour AS stock_Colour
        FROM order_lines
        JOIN orders ON order_lines.Orders_ID = orders.Id
        JOIN customers ON orders.customer_ID = customers.Id
        JOIN catalogue ON order_lines.Catalogue_ID = catalogue.Id
        JOIN stock ON  order_lines.Stock_ID = stock.Id
        WHERE order_lines.Orders_ID = 34 AND  customers.Email = 'kenneth@bransholm.dk';
    `;
    const [result] = await dbConnection.execute(queryString);
    response.json(result);
  } catch (error) {
    console.error(error);
    response
      .status(500)
      .json({ message: "An Internal Server Error Has Occured" });
  }
});

export default viewOrdrerRouter;