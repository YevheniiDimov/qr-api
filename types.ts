export type NftMetadata = {
    name: string;
    description: string;
    image: string;
    animation_url: string;
    external_url: string;
    attributes: {
      trait_type: string;
      value: string;
    }[];
    properties: {
      files: {
        uri: string;
        type: string;
        cdn: boolean;
      }[];
      category: string;
    };
};
  
export type TicketMetadata = NftMetadata & {
    attributes: [
      {
        trait_type: 'expiry_time';
        value: string;
      },
      {
        trait_type: 'ticket_type';
        value: string;
      },
      {
        trait_type: 'allowed_visits';
        value: string;
      },
      {
        trait_type: 'visits';
        value: string;
      },
    ];
};