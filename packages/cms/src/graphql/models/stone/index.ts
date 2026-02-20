import { stoneResolversConfig } from './stone';
import { stoneClarityResolversConfig } from './stoneClarity';
import { stoneClarityEnhancementResolversConfig } from './stoneClarityEnhancement';
import { stoneClarityTypeResolversConfig } from './stoneClarityType';
import { stoneColorResolversConfig } from './stoneColor';
import { stoneColorDominantResolversConfig } from './stoneColorDominant';
import { stoneColorEnhancementResolversConfig } from './stoneColorEnhancement';
import { stoneColorIntensityResolversConfig } from './stoneColorIntensity';
import { stoneColorSecondaryResolversConfig } from './stoneColorSecondary';
import { stoneCutResolversConfig } from './stoneCut';
import { stoneCutStyleResolversConfig } from './stoneCutStyle';
import { stoneFluorescenceResolversConfig } from './stoneFluorescence';
import { stoneGeographicResolversConfig } from './stoneGeographic';
import { stoneGirdleFinishResolversConfig } from './stoneGirdleFinish';
import { stoneGirdleThicknessResolversConfig } from './stoneGirdleThickness';
import { stoneGradingReportResolversConfig } from './stoneGradingReport';
import { stoneHueResolversConfig } from './stoneHue';
import { stoneIntensityResolversConfig } from './stoneIntensity';
import { stoneOriginResolversConfig } from './stoneOrigin';
import { stonePolishResolversConfig } from './stonePolish';
import { stoneSettingFamilyResolversConfig } from './stoneSettingFamily';
import { stoneSettingNameResolversConfig } from './stoneSettingName';
import { stoneShapeResolversConfig } from './stoneShape';
import { stoneSymmetryResolversConfig } from './stoneSymmetry';
import { stoneToneResolversConfig } from './stoneTone';
import { stoneTransparencyResolversConfig } from './stoneTransparency';
import { stoneTreatmentResolversConfig } from './stoneTreatment';
import { stoneTypeResolversConfig } from './stoneType';

export const AllStoneEntitiesResolver = {
  ...stoneResolversConfig,
  ...stoneTypeResolversConfig,
  ...stoneTreatmentResolversConfig,
  ...stoneTransparencyResolversConfig,
  ...stoneToneResolversConfig,
  ...stoneSymmetryResolversConfig,
  ...stoneSettingNameResolversConfig,
  ...stoneSettingFamilyResolversConfig,
  ...stonePolishResolversConfig,
  ...stoneOriginResolversConfig,
  ...stoneIntensityResolversConfig,
  ...stoneHueResolversConfig,
  ...stoneGradingReportResolversConfig,
  ...stoneGirdleThicknessResolversConfig,
  ...stoneGirdleFinishResolversConfig,
  ...stoneGeographicResolversConfig,
  ...stoneFluorescenceResolversConfig,
  ...stoneCutStyleResolversConfig,
  ...stoneCutResolversConfig,
  ...stoneColorSecondaryResolversConfig,
  ...stoneColorIntensityResolversConfig,
  ...stoneColorEnhancementResolversConfig,
  ...stoneColorDominantResolversConfig,
  ...stoneClarityTypeResolversConfig,
  ...stoneClarityEnhancementResolversConfig,
  ...stoneClarityResolversConfig,
  ...stoneColorResolversConfig,
  ...stoneShapeResolversConfig,
};
