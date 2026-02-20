import { useTenantRoutes } from '@router/routes';

const useTableElementRoute = (eventType: string | undefined) => {
  const routes = useTenantRoutes();

  switch (eventType) {
    case 'adjustment':
      return routes?.inventory?.inventoryAdjustment?.index;
    case 'transfer_in':
    case 'transfer_out':
      return routes?.inventory?.transferOrders?.index;
    case 'return':
    case 'canceled_return':
    case 'purchase_return':
      return routes?.inventory?.returns?.index;
    case 'pos_order_item_add':
    case 'pos_order_item_remove':
      return routes?.selling?.pos?.index;
    case 'products':
      return routes?.inventory?.inventoryManagement?.products?.index;
    case 'composite_products':
      return routes?.inventory?.inventoryManagement?.compositeProducts?.index;
    case 'services':
      return routes?.inventory?.inventoryManagement?.services?.index;
    case 'memberships':
      return routes?.inventory?.inventoryManagement?.memberships?.index;
    case 'classes':
      return routes?.inventory?.inventoryManagement?.classes?.index;
    case 'contacts':
      return routes?.crm?.contacts;
    case 'estimate':
      return routes?.contracts?.estimates.preview;
    case 'purchase':
      return routes?.contracts?.purchase.preview;
    case 'invoice':
      return routes?.contracts.invoices.preview;
    case 'companies':
      return routes?.crm?.companies;
    case 'leads':
      return routes?.crm?.leads;
    case 'employees':
      return routes?.hr?.dashboard;
    default:
      return routes?.index;
  }
};

export default useTableElementRoute;
