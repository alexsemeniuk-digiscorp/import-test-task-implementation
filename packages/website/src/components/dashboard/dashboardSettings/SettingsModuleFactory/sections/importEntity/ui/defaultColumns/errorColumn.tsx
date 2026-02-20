import RenderId from '@components/accounting/transactions/TransactionTable/TransactionColumns/RenderId';
import { baseColumnFactory } from '@ui/table/column';

export const errorsColumn = baseColumnFactory({
  title: 'ERRORS',
  dataIndex: ['errors'],
  render: (value: string[]) => {
    const errorsString = value?.join('. ');
    return <RenderId value={errorsString} symbolsAmount={Infinity} />;
  },
  width: 600,
});
