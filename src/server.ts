import express from 'express';
import { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  /*
  GET /filteredimage?image_url={{URL}}
  endpoint to filter an image from a public url.
  QUERY PARAMATERS
      image_url: URL of a publicly accessible image
  RETURNS
    the filtered image file
  */
  app.get('/filteredimage',
    async( req: Request, res: Response ) => {
      const img_url = req.query.image_url;

      if (!img_url){
        return res.status(400).send("image_url param is required");
      }

      await filterImageFromURL(img_url)
      .then((filtered_img_path: string) => {
        return res.status(200).sendFile(filtered_img_path, () => { 
          deleteLocalFiles([filtered_img_path]); 
        });
      });
    } 
  );

  
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req: Request, res: Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();