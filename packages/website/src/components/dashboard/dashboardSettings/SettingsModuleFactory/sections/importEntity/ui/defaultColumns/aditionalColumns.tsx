import RenderId from '@components/accounting/transactions/TransactionTable/TransactionColumns/RenderId';
import { baseColumnFactory } from '@ui/table/column';
import { COLUMN_WIDTH_XXL } from '@ui/table/helpers';

export const productId = baseColumnFactory({
  title: 'PRODUCT ID',
  dataIndex: ['productId'],
  render: (value) => <RenderId copyable value={value} />,
  width: COLUMN_WIDTH_XXL,
});
