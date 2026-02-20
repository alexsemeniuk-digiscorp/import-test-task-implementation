export const discountPopulation = {
  fields: ['type', 'amount'],
  populate: {
    applicableProducts: {
      fields: ['id'],
    },
    excludedProducts: {
      fields: ['id'],
    },
    applicableCompositeProducts: {
      fields: ['id'],
    },
    excludedCompositeProducts: {
      fields: ['id'],
    },
    applicableServices: {
      fields: ['id'],
    },
    excludedServices: {
      fields: ['id'],
    },
    applicableMemberships: {
      fields: ['id'],
    },
    excludedMemberships: {
      fields: ['id'],
    },
    applicableClasses: {
      fields: ['id'],
    },
    excludedClasses: {
      fields: ['id'],
    },
  },
};
