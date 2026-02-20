import {
  Action,
  ActionType,
  ImportingProcesses,
} from '@app/ImportingContext/types/types';

export const importingReducer = (
  state: ImportingProcesses,
  action: Action,
): ImportingProcesses => {
  switch (action.type) {
    case ActionType.START_IMPORT: {
      const newState = { ...state };
      newState[action.importType].isLoading = true;
      newState[action.importType].result.unvalidatedImports = [];
      return newState;
    }
    case ActionType.FINISH_IMPORT: {
      const newState = { ...state };
      newState[action.importType].result = {
        ...newState[action.importType].result,
        ...action.payload,
      };
      newState[action.importType].isLoading = false;
      return newState;
    }
    case ActionType.SET_CUSTOM_FIELDS: {
      const newState = { ...state };
      newState.contacts.customFieldsColumns = action.payload;
      return newState;
    }
    case ActionType.SET_MAX_COUNTS: {
      const newState = { ...state };
      if (action?.payload?.maxProductsCount)
        newState.products.maxProductsCount = action.payload.maxProductsCount;

      if (action?.payload?.maxWishlistProductsCount) {
        newState.wishlist.maxWishlistProductsCount =
          action?.payload?.maxWishlistProductsCount;
      }

      if (action?.payload?.maxImagesCount) {
        newState.products.maxImagesCount = action.payload.maxImagesCount;
      }
      if (action.payload.maxNotesCount)
        newState.contacts.maxNotesCount = action.payload.maxNotesCount;
      if (action.payload.maxNotesCount)
        newState.contacts.maxAdditionalEmailsCount =
          action.payload.maxAdditionalEmailsCount;
      if (action.payload.maxNotesCount)
        newState.contacts.maxAdditionalPhoneNumbersCount =
          action.payload.maxAdditionalPhoneNumbersCount;
      if (action.payload.maxNotesCount)
        newState.contacts.maxAdditionalAddressesCount =
          action.payload.maxAdditionalAddressesCount;
      return newState;
    }
    case ActionType.SET_LOADING: {
      const newState = { ...state };
      newState[action.importType].isLoading = action.isLoading;
      return newState;
    }
    case ActionType.FORCE_SET_RESULT_TABLE: {
      const { importType, tableType, forceUpdatingArr } = action;
      const newState = { ...state };
      newState[importType].result[tableType] = forceUpdatingArr;
      return newState;
    }
    default:
      return state;
  }
};

export const initialState: ImportingProcesses = {
  contacts: {
    result: {
      completedImports: [],
      unvalidatedImports: [],
      needChangeCreations: [],
    },
    isLoading: false,
    customFieldsColumns: [],
    maxNotesCount: 0,
    maxAdditionalEmailsCount: 0,
    maxAdditionalPhoneNumbersCount: 0,
    maxAdditionalAddressesCount: 0,
  },
  companies: {
    result: {
      completedImports: [],
      unvalidatedImports: [],
      needChangeCreations: [],
    },
    isLoading: false,
    customFieldsColumns: [],
    maxNotesCount: 0,
    maxAdditionalEmailsCount: 0,
    maxAdditionalPhoneNumbersCount: 0,
    maxAdditionalAddressesCount: 0,
  },
  contactRelations: {
    result: {
      completedImports: [],
      unvalidatedImports: [],
    },
    isLoading: false,
  },
  wishlist: {
    result: {
      completedImports: [],
      unvalidatedImports: [],
    },
    isLoading: false,
    maxWishlistProductsCount: 0,
  },
  products: {
    result: {
      completedImports: [],
      unvalidatedImports: [],
      needChangeCreations: [],
    },
    isLoading: false,
    maxImagesCount: 0,
    maxProductsCount: 0,
  },
  updateDefaultPrice: {
    isLoading: false,
    result: {
      completedImports: [],
      unvalidatedImports: [],
    },
  },
  orders: {
    result: {
      completedImports: [],
      unvalidatedImports: [],
    },
    isLoading: false,
    maxImagesCount: 0,
    maxProductsCount: 0,
  },
};
