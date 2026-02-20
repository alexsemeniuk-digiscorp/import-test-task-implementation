export interface ImportResult<T = any> {
  completedImports: T[];
  unvalidatedImports: T[];
  needChangeCreations?: T[];
}

export interface ImportProcess<T = any> {
  maxWishlistProductsCount?: number;
  maxAdditionalAddressesCount?: number;
  maxAdditionalPhoneNumbersCount?: number;
  maxAdditionalEmailsCount?: number;
  maxNotesCount?: number;
  result: ImportResult<T>;
  isLoading: boolean;
  maxImagesCount?: number;
  maxProductsCount?: number;
  customFieldsColumns?: string[];
}

export interface ImportingProcesses {
  contacts: ImportProcess;
  companies: ImportProcess;
  products: ImportProcess;
  updateDefaultPrice: ImportProcess;
  orders: ImportProcess;
  contactRelations: ImportProcess;
  wishlist: ImportProcess;
}

export interface ParsedObject<T = any> {
  maxAdditionalAddressesCount: number;
  maxAdditionalEmailsCount: number;
  completedCreations?: T[];
  spoiledCreations?: T[];
  needChangeCreations?: T[];
  customFieldsArr?: string[];
  maxNotesCount?: number;
  maxProductsCount?: number;
  maxImagesCount?: number;
  maxWishlistProductsCount?: number;
}

export type ConfigType = 'products' | 'updateDefaultPrice';

export enum ActionType {
  START_IMPORT = 'START_IMPORT',
  FINISH_IMPORT = 'FINISH_IMPORT',
  SET_CUSTOM_FIELDS = 'SET_CUSTOM_FIELDS',
  SET_MAX_COUNTS = 'SET_MAX_COUNTS',
  SET_LOADING = 'SET_LOADING',
  REMOVE_ITEM = 'REMOVE_ITEM',
  FORCE_SET_RESULT_TABLE = 'FORCE_SET_RESULT_TABLE',
}

export type Action =
  | { type: ActionType.START_IMPORT; importType: ConfigType }
  | {
      type: ActionType.FINISH_IMPORT;
      importType: ConfigType;
      payload: ImportResult;
    }
  | {
      type: ActionType.SET_CUSTOM_FIELDS;
      importType: Extract<ConfigType, 'contacts'>;
      payload: string[];
    }
  | {
      type: ActionType.SET_MAX_COUNTS;
      importType: ConfigType;
      payload: {
        maxAdditionalEmailsCount?: number;
        maxAdditionalPhoneNumbersCount?: number;
        maxAdditionalAddressesCount?: number;
        maxNotesCount?: number;
        maxProductsCount?: number;
        maxImagesCount?: number;
        maxWishlistProductsCount?: number;
      };
    }
  | {
      type: ActionType.SET_LOADING;
      importType: ConfigType;
      isLoading: boolean;
    }
  | {
      type: ActionType.REMOVE_ITEM;
      importType: ConfigType;
      tableType: keyof ImportResult;
      localId: string;
    }
  | {
      type: ActionType.FORCE_SET_RESULT_TABLE;
      importType: ConfigType;
      tableType: keyof ImportResult;
      forceUpdatingArr: any[];
    };

export type ImportResultKeys = keyof ImportResult;
