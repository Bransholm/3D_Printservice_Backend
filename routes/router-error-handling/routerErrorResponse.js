// Genbrugelige funktioner.
function InternalServerErrorResponse(error, response) {
  console.error(error);
  response
    .status(500)
    .json({ message: "An Internal Server Error Has Occured" });
}

function rowIdNotFoundResponse(id, response) {
  return response
    .status(404)
    .json({ error: `The artist with the id ${id} does not exist` });
}

function successFullDeleteResponse(id, response) {
  response.json({ message: `row ${id} deleted successfully` });
}

export {
  InternalServerErrorResponse,
  rowIdNotFoundResponse,
  successFullDeleteResponse,
};
