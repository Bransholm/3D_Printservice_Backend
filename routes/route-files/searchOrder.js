import { Router, response } from "express";
import dbConnection from "../../data-layer/data.js";

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

const searchOrderRouter = Router();

searchOrderRouter.get("/", async (request, response) => {
	console.log("You are now searching O");
	try {
		const searchType = request.query.type;
		const searchTerm = request.query.q;

		let query = "";
		let tableName = "";

		if (searchType === "Status") {
			query = "SELECT * from orders WHERE Status LIKE ?";
			tableName = "orders";
		} else if (searchType === "TotalPrice") {
			query = "SELECT * from orders WHERE TotalPrice LIKE ?";
			tableName = "orders";
		} else {
			return response.status(400).json({ error: "Invalid search type" });
		}

		const [rows] = await dbConnection.query(query, [`%${searchTerm}%`]);
		response.json({ [tableName]: rows });
	} catch (error) {
		console.error("There was an error when attempting to search", error);
		response.status(500).json({ error: "An error occurred while searching" });
	}
});
