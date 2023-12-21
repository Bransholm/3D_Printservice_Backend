//Dependensies goes here:
import express from "express";
import cors from "cors";

//Route imports goes here:
import catalogueRouter from "./routes/route-files/catalogue.js";
import startRouter from "./routes/route-files/start.js";
// import productRouter from "./routes/route-files/products.js";
import stockRouter from "./routes/route-files/stock.js";
import avialableStockRouter from "./routes/route-files/available-stock.js";
// Available ???? 42.
import searchCatalogueRouter from "./routes/route-files/search-catalogue.js";
// import searchOrderRouter from "./routes/route-files/searchOrder.js";

const app = express();
const port = process.env.PORT || 4811;

app.use(express.json());
app.use(cors());

//The routes goes here:
app.use("/", startRouter);
app.use("/catalogue", catalogueRouter);
app.use("/stock", stockRouter);
app.use("/availableStock", avialableStockRouter);
// app.use("/product", productRouter);
app.use("/search_Catalogue", searchCatalogueRouter);
// app.use("/search_Order", searchOrderRouter);
// app.use(searchCatalogueRouter);424242424242424242424242

app.listen(port, () => {
	console.log(
		`The sever is running on port http://127.0.0.1:${port}\n 3DPrintservice_backend is live`
	);
});

//Test comment for Auto GitHub deployment 4
