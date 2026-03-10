export interface GeneratedImage {
  url: string;
  topic: string;
  timestamp: number;
  aspectRatio: string;
}

export interface InfographicStyle {
  id: string;
  label: string;
  icon: string;
  prompt: string;
  isCustom?: boolean;
}

export interface GenerationModel {
  id: string;
  label: string;
  icon: string;
  isCustom?: boolean;
}

export interface ApiError {
  message: string;
}

// Augment window to include aistudio properties
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}
