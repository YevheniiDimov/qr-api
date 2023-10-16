import { fetchDigitalAsset } from "@metaplex-foundation/mpl-token-metadata";
import { PublicKey, Umi } from "@metaplex-foundation/umi";
import { TicketMetadata } from "./types";

type ValidationResult = {
    valid: boolean;
    message: string;
}

// Returns true when ticket is in the collection (event), false otherwise
export async function checkTicket(umi: Umi, ticketPublicKey: PublicKey, collectionPublicKey: PublicKey): Promise<ValidationResult> {
    let ticketItem;

    try {
        ticketItem = await fetchDigitalAsset(umi, ticketPublicKey);
    }
    catch (err) {
        return {
            valid: false,
            message: "Failed to fetch the tiket"
        }
    }

    if (!ticketItem) {
        return {
            valid: false,
            message: "Ticket public key doesn't exist"
        }
    }
    if (ticketItem.metadata.collection.__option !== "Some") {
        return {
            valid: false,
            message: "Ticket public key is not a ticket"
        }
    }

    let ticket;

    try {
        const fetchPromise = await fetch(ticketItem.metadata.uri);
        ticket = await fetchPromise.json() as TicketMetadata;
    }
    catch (err) {
        return {
            valid: false,
            message: "Failed to fetch the tiket";
        }
    }
    
    const visitsTrait = ticket.attributes.find(trait => trait.trait_type === "visits");
    const allowedVisitsTrait = ticket.attributes.find(trait => trait.trait_type === "allowed_visits");
    const expiryTimeTrait = ticket.attributes.find(trait => trait.trait_type === "expiry_time");

    if (!visitsTrait || !allowedVisitsTrait || !expiryTimeTrait) {
        return {
            valid: false,
            message: "Ticket has no visits or allowed visits trait or expiry time trait"
        }
    }

    if (visitsTrait.value >= allowedVisitsTrait.value) {
        return {
            valid: false,
            message: "Ticket has reached its allowed visits"
        }
    }

    if (new Date(expiryTimeTrait.value) < new Date()) {
        return {
            valid: false,
            message: "Ticket has expired"
        }
    }

    let collectionItem;

    try {
        collectionItem = await fetchDigitalAsset(umi, collectionPublicKey);
    }
    catch (err) {
        return {
            valid: false,
            message: "Failed to fetch the collection"
        }
    }

    if (!collectionItem) {
        return {
            valid: false,
            message: "Collection public key doesn't exist"
        }
    }
    if (collectionItem.metadata.collection.__option === "Some") {
        return {
            valid: false,
            message: "Collection public key is not a collection"
        }
    }

    return {
        valid: true,
        message: "Ticket is valid"
    }
}