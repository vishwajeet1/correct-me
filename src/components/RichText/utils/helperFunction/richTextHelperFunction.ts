import {
  Correction,
  MessageTypeDto,
  SelectionInfoDto,
  SpellingMistakeDto,
} from "@/components/RichText/utils/NotesInterface";
import {
  ContentBlock,
  ContentState,
  EditorState,
  Modifier,
  SelectionState,
} from "draft-js";
import { CorrectionConstant } from "@/components/RichText/utils/NotesContant";

export const getContentSelectionInfo = (
  editorState: EditorState,
  correction: Correction
): any => {
  const { startIndex, endIndex } = correction;
  const startBlockData = findContentBlock(editorState, startIndex);
  const endBlockData = findContentBlock(editorState, endIndex);
  console.log("startBlockData", startBlockData.block?.getKey());
  return {
    anchorKey: startBlockData.block?.getKey(),
    focusKey: endBlockData.block?.getKey(),
    anchorOffset: startBlockData.index,
    focusOffset: endBlockData.index + 1,
  };
};

export const findContentBlock = (editorState: EditorState, index: number) => {
  let currentIndex = index;
  let payload: {
    block: null | ContentBlock;
    index: number;
  } = {
    block: null,
    index: 0,
  };
  const contentBlock = editorState.getCurrentContent().getBlockMap();
  contentBlock.every((block) => {
    if (block) {
      const lengthOfBlock = block.getText().length;
      if (lengthOfBlock > currentIndex && currentIndex != -1) {
        payload = {
          block,
          index: currentIndex,
        };
        currentIndex = -1;
        return false;
      } else if (currentIndex != -1) {
        currentIndex -= lengthOfBlock;
      }
      currentIndex--;
    }
    return true;
  });
  return payload;
};

export const getSelectionDetails = (
  editorState: EditorState
): SelectionInfoDto => {
  let selectionState = editorState.getSelection();
  let anchorKey = selectionState.getAnchorKey();
  let currentContent = editorState.getCurrentContent();
  let currentContentBlock = currentContent.getBlockForKey(anchorKey);
  const startOffset = selectionState.getStartOffset();
  const endOffset = selectionState.getEndOffset();
  const startBlockKey = selectionState.getStartKey();
  const endBlockKey = selectionState.getEndKey();
  let selectedText = currentContentBlock
    .getText()
    .slice(startOffset, endOffset);
  return {
    id: `${startOffset}-${endOffset}-${startBlockKey}-${endBlockKey}`,
    text: selectedText,
    startOffset: startOffset,
    endOffset: endOffset,
    startBlockKey,
    endBlockKey,
  };
};

export const highlightGrammarMistake = (
  editorState: EditorState,
  corrections: Array<Correction>
): {
  editor: EditorState;
  grammarMistakesNotes: Array<SpellingMistakeDto>;
} | null => {
  try {
    let updatedGrammarMistakesArray: Array<SpellingMistakeDto> = [];
    let updatedContentState = editorState.getCurrentContent();
    corrections.forEach((correction, index, array) => {
      try {
        const { anchorKey, focusKey, anchorOffset, focusOffset } =
          getContentSelectionInfo(editorState, correction);
        const noteId = `${anchorOffset}-${focusOffset}-${anchorKey}-${anchorOffset}`;
        const correctionPayload: SpellingMistakeDto = {
          ...correction,
          id: noteId,
          startBlockId: anchorKey,
          endBlockId: focusKey,
          startIndex: anchorOffset,
          endIndex: focusOffset,
        };
        const selectionState = editorState.getSelection().merge({
          anchorKey,
          focusKey,
          anchorOffset,
          focusOffset,
        });
        const entityKey = updatedContentState
          .createEntity(CorrectionConstant.NOTE_ENTITY_TYPE, "MUTABLE", {
            correctionPayload: correctionPayload,
          })
          .getLastCreatedEntityKey();
        const newContentState = Modifier.applyEntity(
          updatedContentState,
          selectionState,
          entityKey
        );
        updatedContentState = newContentState;
        updatedGrammarMistakesArray = [
          ...updatedGrammarMistakesArray,
          correctionPayload,
        ];
      } catch (e: any) {
        console.log("err", e.message);
      }
    });
    return {
      editor: EditorState.push(
        editorState,
        updatedContentState,
        "apply-entity"
      ),
      grammarMistakesNotes: updatedGrammarMistakesArray,
    };
  } catch (e: any) {
    console.log("err", {
      message: e.message,
    });
    return null;
  }
};

export function removeDecoratorFromSelection(
  editorState: EditorState,
  selectionState: SelectionState,
  decoratorType: string
) {
  let newContentState = editorState.getCurrentContent();
  newContentState = Modifier.applyEntity(newContentState, selectionState, null);
  newContentState = Modifier.removeInlineStyle(
    newContentState,
    selectionState,
    decoratorType
  );
  const newEditorState = EditorState.push(
    editorState,
    newContentState,
    "apply-entity"
  );
  return newEditorState;
}
