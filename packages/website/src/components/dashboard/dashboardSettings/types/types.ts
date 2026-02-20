export interface ImportSectionSettings {
  importPath: string;
  title: string;
  description: string;
  isCapitalize?: boolean;
  buttonText?: string;
}

export interface SettingsFactory {
  importSection: ImportSectionSettings;
}

export interface ProcessedData {
  fieldsProcessed: number;
  fieldsTotal: number;
}
