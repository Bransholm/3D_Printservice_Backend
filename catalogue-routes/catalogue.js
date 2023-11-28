import { Router } from "express";
import dbConnection from "../data-layer/data.js";
const catalogueRouter = Router();

catalogueRouter.get("/", async (request, response) => {
  const queryString = /*sql*/ ` 
  
  START TRANSACTION;
  SELECT * FROM albums
  INNER JOIN albums_tracks ON albumID = albums_tracks.album_ID
  INNER JOIN tracks ON trackID = albums_tracks.track_ID
  INNER JOIN artists_tracks ON artists_tracks.track_ID = tracks.trackID
  INNER JOIN artists ON artists.artistID = artists_tracks.artist_ID;
  COMMIT;
  ROLLBACK;
  
  `;

  const [result] = await dbConnection.execute(queryString);
  if (!result) {
    response
      .status(500)
      .json({ message: "An Internal Server Error Has Occured" });
  } else {
    response.json(result);
  }
});


// const getCatalogueData = async () => {
//   const queryString = /*sql*/ `
//     SELECT * FROM albums
//     INNER JOIN albums_tracks ON albumID = albums_tracks.album_ID
//     INNER JOIN tracks ON trackID = albums_tracks.track_ID
//     INNER JOIN artists_tracks ON artists_tracks.track_ID = tracks.trackID
//     INNER JOIN artists ON artists.artistID = artists_tracks.artist_ID;
//   `;
//   const [result] = await dbConnection.execute(queryString);
//   return result;
// };

// const handleInternalServerError = (response) => {
//   response
//     .status(500)
//     .json({ message: "An Internal Server Error Has Occurred" });
// };

// catalogueRouter.get("/", async (request, response) => {
//   try {
//     const result = await getCatalogueData();

//     if (!result) {
//       handleInternalServerError(response);
//     } else {
//       response.json(result);
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     handleInternalServerError(response);
//   }
// });


export default catalogueRouter;

