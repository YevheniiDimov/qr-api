import { fetchDigitalAsset } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey, Umi } from "@metaplex-foundation/umi";
import { TicketMetadata } from "./types";

// Returns true when ticket is in the collection (event), false otherwise
export async function checkTicket(umi: Umi, ticketPublicKey: PublicKey, collectionPublicKey: PublicKey): Promise<Boolean> {
    const ticketItem = await fetchDigitalAsset(umi, ticketPublicKey);

    if (!ticketItem) {
        throw new Error("Ticket public key doesn't exist");
    }
    if (ticketItem.metadata.collection.__option !== "Some") {
        throw new Error("Ticket public key is not a ticket");
    }

    const fetchPromise = await fetch(ticketItem.metadata.uri);
    const ticket = await fetchPromise.json() as TicketMetadata;
    
    const visitsTrait = ticket.attributes.find(trait => trait.trait_type === "visits");
    const allowedVisitsTrait = ticket.attributes.find(trait => trait.trait_type === "allowed_visits");
    const expiryTimeTrait = ticket.attributes.find(trait => trait.trait_type === "expiry_time");

    if (!visitsTrait || !allowedVisitsTrait || !expiryTimeTrait) {
        throw new Error("Ticket has no visits or allowed visits trait or expiry time trait");
    }

    if (visitsTrait.value >= allowedVisitsTrait.value) {
        throw new Error("Ticket has reached its allowed visits");
    }

    if (new Date(expiryTimeTrait.value) < new Date()) {
        throw new Error("Ticket has expired");
    }


    const collectionItem = await fetchDigitalAsset(umi, collectionPublicKey);

    if (!collectionItem) {
        throw new Error("Collection public key doesn't exist");
    }
    if (collectionItem.metadata.collection.__option === "Some") {
        throw new Error("Collection public key is not a collection");
    }

    return ticketItem.metadata.collection.value.key === collectionPublicKey;
}