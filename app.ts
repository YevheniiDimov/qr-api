import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplCandyMachine } from '@metaplex-foundation/mpl-candy-machine';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { checkTicket } from "./checkTIcket";

const express = require('express');

const umi = createUmi('https://api.devnet.solana.com')
  .use(mplTokenMetadata())
  .use(mplCandyMachine());

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});

app.get('/', (request: any, response: any) => {
  response.send({message: "Welcome to QR-code NFTickets API!"});
});

app.post('/validate', async (request: any, response: any) => {
  try {
    console.log(request.body);
    const ticketPublicKey = request.body.ticketPublicKey;
    const collectionPublicKey = request.body.collectionPublicKey;

    const status = await checkTicket(umi, ticketPublicKey, collectionPublicKey)
    console.log(status);
    
    response.send(status);
  }
  catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});