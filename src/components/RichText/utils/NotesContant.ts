import {
  DropDownDto,
  MessageTypeDto,
} from "@/components/RichText/utils/NotesInterface";
export const noteTypeDropDownItems: Array<DropDownDto> = Object.values(
  MessageTypeDto
).map((messageType) => ({
  label: messageType,
  value: messageType,
}));

export const CorrectionConstant = {
  NOTE_ENTITY_TYPE: "NOTE",
  WRITING_NOTE_SPAN: "WRITING_NOTE_SPAN",
  EDITOR_STORAGE_KEY: "EDITOR_STORAGE_KEY",
  TEACHER_STORAGE_KEY: "TEACHER_STORAGE_KEY",
  API_STORAGE_KEY: "API_STORAGE_KEY",
};
