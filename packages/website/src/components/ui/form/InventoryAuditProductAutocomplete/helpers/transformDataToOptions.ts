import { AutocompleteOption } from '@form/inputs/autocompleteInput/AutocompleteInput';
import { get } from 'lodash';

export const transformDataToOptions = (
  data: Maybe<InventoryAuditItemsQuery>,
  type: string,
): AutocompleteOption[] => {
  const inventoryAuditItems = get(data, 'inventoryAuditItems.data', []);

  if (!Array.isArray(inventoryAuditItems)) {
    console.error('inventoryAuditItems is not an array:', inventoryAuditItems);
    return [];
  }

  switch (type) {
    case 'name': {
      const options: AutocompleteOption[] = inventoryAuditItems.map((item) => {
        const label = get(
          item,
          'attributes.productInventoryItem.data.attributes.product.data.attributes.name',
          '',
        );
        const value = label;

        return {
          label,
          value,
        };
      });
      return options.length > 0 ? options : [];
    }
    case 'barcode': {
      const options: AutocompleteOption[] = inventoryAuditItems.map((item) => {
        const label = get(
          item,
          'attributes.productInventoryItem.data.attributes.product.data.attributes.barcode',
          '',
        );
        const value = label;

        return {
          label,
          value,
        };
      });
      return options.length > 0 ? options : [];
    }
    case 'vendor': {
      const options: AutocompleteOption[] = inventoryAuditItems.map((item) => {
        const label = get(
          item,
          'attributes.productInventoryItem.data.attributes.vendor.data.attributes.name',
          '',
        );
        const value = label;

        return {
          label,
          value,
        };
      });
      return options.length > 0 ? options : [];
    }
    default:
      return [];
  }
};
