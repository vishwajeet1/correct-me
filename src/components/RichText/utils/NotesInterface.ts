export enum MessageTypeDto {
  Grammar = "Grammar",
  Spelling = "Spelling",
  Punctuation = "Punctuation",
}

export interface DropDownDto {
  label: string;
  value: string;
}

export interface SpellingMistakeDto {
  id: string;
  type: MessageTypeDto;
  shortDescription: string;
  longDescription: string;
  startIndex: number;
  endIndex: number;
  startBlockId: string;
  endBlockId: string;
  mistakeText: string;
  correctionText: string;
}

export interface Suggestion {
  text: string;
  definition: string;
  category: string;
}

export interface Correction {
  type: MessageTypeDto;
  shortDescription: string;
  longDescription: string;
  startIndex: number;
  endIndex: number;
  mistakeText: string;
  correctionText: string;
  correctionDefinition: string;
  mistakeDefinition: string;
}

export interface Sentence {
  startIndex: number;
  endIndex: number;
  status: string;
}

export interface Stats {
  textLength: number;
  wordCount: number;
  sentenceCount: number;
  longestSentence: number;
}

export interface GrammarCorrectionDto {
  id: string;
  language: string;
  text: string;
  engine: string;
  truncated: boolean;
  timeTaken: number;
  corrections: Correction[];
  sentences: Sentence[];
  autoReplacements: any[];
  stats: Stats;
}

export interface ApiResponseDto<T> {
  success: boolean;
  data: T | null;
  message?: string;
}

export interface SelectionInfoDto {
  id: string;
  text: string;
  startOffset: number;
  endOffset: number;
  startBlockKey: string;
  endBlockKey: string;
}
