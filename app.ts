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

app.post('/validate', (request: any, response: any) => {
  const ticketPublicKey = request.body.ticketPublicKey;
  const collectionPublicKey = request.body.collectionPublicKey;
  const status = {'valid': checkTicket(umi, ticketPublicKey, collectionPublicKey)};

  response.send(status);
});