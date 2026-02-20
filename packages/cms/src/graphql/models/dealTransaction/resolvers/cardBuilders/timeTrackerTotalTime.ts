import { getTotalTime } from '../../../../../utils/getTotalTime';
import { addDollarToFilterKeys } from '../../../../helpers/addDollarToFilterKeys';
import { getTenantFilter } from '../../helpers/helpers';

export const getTimeTrackerTotalTime = async (
  userId,
  dates,
  additionalFilters = {},
) => {
  const tenantFilter = await getTenantFilter(userId);
  const timeTrackerReportFilters = addDollarToFilterKeys(additionalFilters);

  const allTimeTrackers = await strapi.entityService.findMany(
    'api::time-tracker.time-tracker',
    {
      filters: {
        createdAt: {
          $between: [new Date(dates[0]), new Date(dates[1])],
        },
        ...tenantFilter,
        ...timeTrackerReportFilters,
      },
      populate: ['user'],
      fields: ['shiftTime'],
    },
  );
  const data = await allTimeTrackers;
  const total = getTotalTime(data);

  return [
    {
      id: 239,
      name: 'Time in Period',
      totalAsString: total,
      cardImg: 1,
      type: 'employees',
    },
  ];
};
