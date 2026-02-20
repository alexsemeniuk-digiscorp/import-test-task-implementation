export interface SwitcherOptions {
  onCheckedText: string;
  onUncheckedText: string;
  state: boolean;
  setState: (state: boolean) => void;
}

export interface CreateEntitiesInput {
  uploadCsv: File;
  createNewMode?: boolean;
}

export interface ImportRule {
  title: string;
  description: string;
}

export interface MaxArrayCounts {
  maxProductsCount: number;
  maxImagesCount: number;
}
