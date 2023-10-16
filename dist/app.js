"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var umi_bundle_defaults_1 = require("@metaplex-foundation/umi-bundle-defaults");
var mpl_candy_machine_1 = require("@metaplex-foundation/mpl-candy-machine");
var mpl_token_metadata_1 = require("@metaplex-foundation/mpl-token-metadata");
var checkTIcket_1 = require("./checkTIcket");
var express = require('express');
var umi = (0, umi_bundle_defaults_1.createUmi)('https://api.devnet.solana.com')
    .use((0, mpl_token_metadata_1.mplTokenMetadata)())
    .use((0, mpl_candy_machine_1.mplCandyMachine)());
var app = express();
app.use(express.json());
var PORT = process.env.PORT || 3001;
app.listen(PORT, function () {
    console.log("Server Listening on PORT:", PORT);
});
app.post('/validate', function (request, response) {
    var ticketPublicKey = request.body.ticketPublicKey;
    var collectionPublicKey = request.body.collectionPublicKey;
    var status = { 'valid': (0, checkTIcket_1.checkTicket)(umi, ticketPublicKey, collectionPublicKey) };
    response.send(status);
});
