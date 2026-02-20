import { get } from 'lodash';
import { useNavigate } from 'react-router';

type RecordClick =
  | InventoryProductTableFragment
  | InventoryProductGroupTableFragment
  | InventoryResourceTableFragment;

export const useRowClickable = () => {
  const navigate = useNavigate();

  const handleClick = (record: RecordClick) => {
    return {
      onClick: () => navigate(get(record, ['attributes', 'uuid'], '')),
    };
  };

  const style = {
    cursor: 'pointer',
  };

  return { style, handleClick };
};
