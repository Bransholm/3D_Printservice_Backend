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

const searchCatalogueRouter = Router();

// searchRoutes.get("/search", async (request, response) => {
//   console.log("You are now searching");
//   try {
//     const searchType = request.query.type;
//     const searchTerm = request.query.q;

//     let query = "";
//     let tableName = "";

//     if (searchType === "trackName") {
//       query = "SELECT * from tracks WHERE trackName LIKE ?";
//       tableName = "tracks";
//     } else if (searchType === "genre") {
//       query = "SELECT * from tracks WHERE genre LIKE ?";
//       tableName = "tracks";
//     } else if (searchType === "artistName") {
//       query = "SELECT * from artists WHERE artistName LIKE ?";
//       tableName = "artists";
//     } else if (searchType === "activeSince") {
//       query = "SELECT * from artists WHERE activeSince LIKE ?";
//       tableName = "artists";
//     } else if (searchType === "albumName") {
//       query = "SELECT * from albums WHERE albumName LIKE ?";
//       tableName = "albums";
//     } else if (searchType === "edition") {
//       query = "SELECT * from albums WHERE edition LIKE ?";
//       tableName = "albums";
//     } else {
//       return response.status(400).json({ error: "Invalid search type" });
//     }

//     const [rows] = await dbConnection.query(query, [`%${searchTerm}%`]);
//     response.json({ [tableName]: rows });
//   } catch (error) {
//     console.error("There was an error when attempting to search", error);
//     response.status(500).json({ error: "An error occurred while searching" });
//   }
// });


searchCatalogueRouter.get("/", async (request, response) => {
	console.log("You are now searching C");
	try {
		const searchType = request.query.type;
		const searchTerm = request.query.q;

		let query = "";
		let tableName = "";

		if (searchType === "Title") {
			query = "SELECT * from catalogue WHERE Title LIKE ?";
			tableName = "catalogue";
		} else if (searchType === "Category") {
			query = "SELECT * from catalogue WHERE Category LIKE ?";
			tableName = "catalogue";
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

// searchCatalogueRouter.get("/", async (request, response) => {
// 	console.log("You are now searching");
// 	try {
// 		const query = request.query.q.toLocaleLowerCase();
// 		const queryString = /*sql*/ `

//     SELECT *
//     FROM catalogue
//     WHERE Category LIKE ?
//     ORDER BY Title`;

// 		// OR ItemDescription LIKE ?
// 		// OR ImageLink LIKE ?
// 		// OR Category LIKE ?

// 		const [rows] = await dbConnection.query(queryString, values[`%${query}%`]);
// 		response.json({ catalogue: rows });
// 	} catch (error) {
// 		console.error("There was an error when attempting to search", error);
// 		response.status(500).json({ error: "An error occurred while searching" });
// 	}
// });

// searchCatalogueRouter.get("/search", async (request, response) => {
//   try {
//     const searchType = request.query.type;
//     const searchTerm = request.query.q;

//     let query = "";
//     let tableName = "";

//     if (searchType === "Category") {
//       query = "SELECT * from catalogue WHERE Category LIKE ?";
//       // Da vi skal have en search for hvert table, kan vi så slette denne variabel "tableName"? - Lukas
//       tableName = "products";
//     } else {
//       return response.status(400).json({ error: "Invalid search type" });
//     }

//     const [rows] = await dbConnection.query(query, [`%${searchTerm}%`]);

//     // Der behøver ikke være et tablename fordi vi overholder REST?? - Lukas
//     response.json({ [tableName]: rows });
//   } catch (error) {
//     console.error("There was an error when attempting to search", error);
//     response.status(500).json({ error: "An error occurred while searching" });
//   }
// });

export default searchCatalogueRouter;
