import { AnyObject } from '../../types';

type ItemType = AnyObject & { uuid: string };
export const getItemsUuids = (items: ItemType[]) =>
  items.map((el) => el.uuid) ?? [];
