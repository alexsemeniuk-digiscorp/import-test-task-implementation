export type ConfigTypeMapping =
  | 'products'
  | 'orders'
  | 'contacts'
  | 'wishlists';

export const maxCountsMapping: Record<
  ConfigTypeMapping,
  { payloadKeys: string[] }
> = {
  products: {
    payloadKeys: ['maxProductsCount', 'maxImagesCount'],
  },
  orders: {
    payloadKeys: ['maxProductsCount', 'maxImagesCount'],
  },
  contacts: {
    payloadKeys: [
      'maxNotesCount',
      'maxAdditionalEmailsCount',
      'maxAdditionalPhoneNumbersCount',
      'maxAdditionalAddressesCount',
    ],
  },
  wishlists: {
    payloadKeys: ['maxWishlistProductsCount'],
  },
};
