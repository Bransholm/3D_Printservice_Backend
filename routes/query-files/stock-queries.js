import dbConnection from "../../data-layer/data.js";

// QUERY-STRING + db.execute
async function readAllStockItemsQuery() {
  const queryString = /*sql*/ `SELECT * FROM stock;`;
  const [result] = await dbConnection.execute(queryString);
  return result;
}

// Create catalogue item
async function createStockItemQuery(request) {
  const body = request.body;
  const queryString =
    "INSERT INTO stock (Name, Material, Colour, GramInStock, MinAmountReached, SalesPrize) VALUES (?, ?, ?, ?, ?, ?);";
  const values = [
    body.Name,
    body.Material,
    body.Colour,
    body.GramInStock,
    body.MinAmountReached,
    body.SalesPrize,
  ];

  const result = await dbConnection.execute(queryString, values);
  return result;
}

// Get catalogue item by ID
async function readStockItemByIdQuery(id, request) {
  const queryString = "SELECT * FROM stock WHERE id = ?";
  const values = [id];

  const [result] = await dbConnection.execute(queryString, values);
  console.log("Result is: ", result);
  return result;
}

// Update catalogue item by ID
async function updateStockItemQuery(id, request) {
  const body = request.body;
  // Update query
  const queryString =
    "UPDATE stock SET Name=?, Material=?, Colour=?, GramInStock=?, MinAmountReached=?, SalesPrize=? WHERE id=?;";
  const values = [
    body.Name,
    body.Material,
    body.Colour,
    body.GramInStock,
    body.MinAmountReached,
    body.SalesPrize,
    id,
  ];

  // Execute the update query within the transaction
  const [result] = await dbConnection.query(queryString, values);
  return result;
}

// Delete catalogue item by ID
async function deleteStockItemByIdQuery(id, request) {
  const values = [id];
  // Delete the given item from the catalogue
  const queryString = "DELETE FROM stock WHERE id=?";
  const [result] = await dbConnection.query(queryString, values);
  return result;
}

export {
  readAllStockItemsQuery,
  createStockItemQuery,
  readStockItemByIdQuery,
  updateStockItemQuery,
  deleteStockItemByIdQuery,
};
