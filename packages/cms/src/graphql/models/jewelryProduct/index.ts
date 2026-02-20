import { backingResolversConfig } from './backing';
import { boxPaperResolversConfig } from './boxPaper';
import { countryResolversConfig } from './country';
import { designStyleResolversConfig } from './designStyle';
import { engravingTypeResolversConfig } from './engravingType';
import { jewelryConditionTypeResolversConfig } from './jewelryConditionType';
import { jewelryGenderTypeResolversConfig } from './jewelryGenderType';
import { jewelryProductResolversConfig } from './jewelryProduct';
import { jewelryProductTypeResolversConfig } from './jewelryProductType';
import { knotStyleResolversConfig } from './knotStyle';
import { linkStyleResolversConfig } from './linkStyle';
import { linkTypeResolversConfig } from './linkType';
import { manufacturingProcessTypeResolversConfig } from './manufacturingProcess';
import { materialGradeResolversConfig } from './materialGrade';
import { metalFinishTypeResolversConfig } from './metalFinishType';
import { metalTypeResolversConfig } from './metalType';
import { pieceResolversConfig } from './piece';
import { plattingTypeResolversConfig } from './plattingType';
import { shankStyleResolversConfig } from './shankStyle';
import { shapeResolversConfig } from './shape';
import { sizeResolversConfig } from './size';
import { specificTypesResolversConfig } from './specificType';
import { strandResolversConfig } from './strand';
import { strandsLengthResolversConfig } from './strandsLength';

export const AllJewelryProductEntitiesResolvers = {
  ...jewelryProductResolversConfig,
  ...metalTypeResolversConfig,
  ...strandsLengthResolversConfig,
  ...strandResolversConfig,
  ...specificTypesResolversConfig,
  ...sizeResolversConfig,
  ...shapeResolversConfig,
  ...shankStyleResolversConfig,
  ...plattingTypeResolversConfig,
  ...pieceResolversConfig,
  ...metalFinishTypeResolversConfig,
  ...materialGradeResolversConfig,
  ...manufacturingProcessTypeResolversConfig,
  ...linkTypeResolversConfig,
  ...linkStyleResolversConfig,
  ...jewelryConditionTypeResolversConfig,
  ...jewelryProductTypeResolversConfig,
  ...jewelryGenderTypeResolversConfig,
  ...engravingTypeResolversConfig,
  ...backingResolversConfig,
  ...boxPaperResolversConfig,
  ...countryResolversConfig,
  ...designStyleResolversConfig,
  ...knotStyleResolversConfig,
};
