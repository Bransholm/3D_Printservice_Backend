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
  const queryString = /*sql*/
    `INSERT INTO stock (Name, Material, Colour, GramInStock, MinAmountReached, SalesPrice) VALUES (?, ?, ?, ?, ?, ?);`;
  const values = [
    body.name,
    body.material,
    body.colour,
    body.gramInStock,
    body.minAmountReached,
    body.salesPrice,
  ];

  const result = await dbConnection.execute(queryString, values);
  return result;
}

// Get catalogue item by ID
async function readStockItemByIdQuery(id, request) {
  const queryString =/*sql*/ `SELECT * FROM stock WHERE id = ?`;
  const values = [id];

  const [result] = await dbConnection.execute(queryString, values);
  console.log("Result is: ", result);
  return result;
}



// Update catalogue item by ID
async function updateStockItemQuery(id, request) {
  const body = request.body;
  // Update query
  const queryString =/*sql*/
    `UPDATE stock SET Name=?, Material=?, Colour=?, GramInStock=?, MinAmountReached=?, SalesPrice=? WHERE Id=?`;
  const values = [
    body.name,
    body.material,
    body.colour,
    body.gramInStock,
    body.minAmountReached,
    body.salesPrice,
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
  const queryString = /*sql*/`DELETE FROM stock WHERE id=?;`;
  const [result] = await dbConnection.query(queryString, values);
  return result;
}

//Reads asll Materials (where stock minAmountReached is FALSE)

async function readAvailavleStockItemsQuery() {
  const queryString = /*sql*/ `SELECT * FROM stock WHERE MinAmountReached=0;`;
  const [result] = await dbConnection.execute(queryString);
  return result;
}



export {
  readAllStockItemsQuery,
  createStockItemQuery,
  readStockItemByIdQuery,
  updateStockItemQuery,
  deleteStockItemByIdQuery,
  readAvailavleStockItemsQuery
};
