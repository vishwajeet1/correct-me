import {
  ContentState,
  convertFromRaw,
  convertToRaw,
  EditorState,
} from "draft-js";
import { CorrectionConstant } from "@/components/RichText/utils/NotesContant";
import { SpellingMistakeDto } from "@/components/RichText/utils/NotesInterface";

export const saveContentOnLocalStorage = (contentState: ContentState) => {
  const contentStateJson = JSON.stringify(convertToRaw(contentState));
  localStorage.setItem(CorrectionConstant.EDITOR_STORAGE_KEY, contentStateJson);
};

export const getContentFromLocalStorage = (): ContentState | null => {
  const rawData = localStorage.getItem(CorrectionConstant.EDITOR_STORAGE_KEY);
  if (!rawData) return null;
  const jsonData = JSON.parse(rawData);
  return convertFromRaw(jsonData);
};

export const saveCorrectionList = (
  correctionList: Array<SpellingMistakeDto>,
  saveRefKey: string
): void => {
  const correctionListJson = JSON.stringify(correctionList);
  localStorage.setItem(saveRefKey, correctionListJson);
};

export const getCorrectionListKey = (
  refKey: string
): Array<SpellingMistakeDto> => {
  const rawData = localStorage.getItem(refKey);
  if (!rawData) return [];
  return JSON.parse(rawData);
};
