// import dbConnection from "dbconnection";
import dbConnection from "../../data-layer/data.js";


// QUERY-STRING + db.execute
async function readCatalougeQuery() {
  const queryString = /*sql*/ `SELECT * FROM catalogue;`;
  const [result] = await dbConnection.execute(queryString);
  return result;
}

// Create catalog item
async function createCatalogueItemQuery(request) {
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
  return result;
}

// Get catalog item by ID
async function readCatalogItemByIdQuery(id, request) {
  const queryString = "SELECT * FROM catalogue WHERE id = ?";
  const values = [id];

  const [result] = await dbConnection.execute(queryString, values);
  console.log("Result is: ", result);
  return result;
}

// Update catalog item by ID
async function updateCatalogueQuery(id, request) {
  const body = request.body;
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
  const [result] = await dbConnection.query(updateQuery, updateValues);
  return result;
}

// Delete catalogue item by ID
async function deleteCatalogueByIdQuery(id, request) {
  const values = [id];
  // Delete the given item from the catalogue
  const queryString = "DELETE FROM catalogue WHERE id=?";
  const [result] = await dbConnection.query(queryString, values);
  return result;
}

export {
  readCatalougeQuery,
  createCatalogueItemQuery,
  readCatalogItemByIdQuery,
  updateCatalogueQuery,
  deleteCatalogueByIdQuery,
};
