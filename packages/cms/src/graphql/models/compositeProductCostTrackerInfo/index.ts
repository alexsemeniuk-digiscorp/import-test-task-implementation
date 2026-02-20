import { colorResolversConfig } from './color';
import { compositeProductAttributeResolversConfig } from './compositeProductAttributes';
import { sizeResolversConfig } from './size';

export const AllCompositeTrackerCostTrackerResolvers = {
  ...colorResolversConfig,
  ...sizeResolversConfig,
  ...compositeProductAttributeResolversConfig,
};
