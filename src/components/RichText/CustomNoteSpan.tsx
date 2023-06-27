import { CompositeDecorator, ContentBlock, ContentState } from "draft-js";
import {
  MessageTypeDto,
  SpellingMistakeDto,
} from "@/components/RichText/utils/NotesInterface";
import { CorrectionConstant } from "@/components/RichText/utils/NotesContant";

const findNoteEntities = (
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState
) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() ===
        CorrectionConstant.NOTE_ENTITY_TYPE
    );
  }, callback);
};

const NoteSpan = (props: any) => {
  const { contentState, entityKey, children } = props;
  const data = contentState.getEntity(entityKey).getData();
  const correctionPayload: SpellingMistakeDto = data.correctionPayload;
  const { id, type } = correctionPayload;

  const styleClass: Record<string, string> = {
    [MessageTypeDto.Grammar]:
      "underline cursor-pointer bg-yellow-200 decoration-yellow-400",
    [MessageTypeDto.Spelling]:
      "underline cursor-pointer bg-red-200 decoration-red-400",
    [MessageTypeDto.Punctuation]:
      "underline cursor-pointer bg-blue-200 decoration-blue-400",
  };
  return (
    <span
      data-id={id}
      data-messagetype={type}
      className={`${styleClass[type]} rounded px-1 ${CorrectionConstant.WRITING_NOTE_SPAN}`}
    >
      {children}
    </span>
  );
};

export const decorator = new CompositeDecorator([
  {
    strategy: findNoteEntities,
    component: NoteSpan,
  },
]);

export default NoteSpan;
