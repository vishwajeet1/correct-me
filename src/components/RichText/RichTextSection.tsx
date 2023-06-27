import {
  FunctionComponent,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { essayWithGrammarMistake } from "@/data/sampleEssay";
import Draft, { Editor, EditorState, RichUtils, ContentState } from "draft-js";
import { Box, Button, Modal, Paper } from "@mui/material";
import { decorator } from "@/components/RichText/CustomNoteSpan";
import AddNoteModal from "@/components/RichText/AddNoteModal";
import { SpellingMistakeDto } from "@/components/RichText/utils/NotesInterface";
import NoteList from "@/components/RichText/NoteList";
import NotePopper from "@/components/RichText/NotePopper";
import { grammarCheckApi } from "@/components/RichText/utils/GrammarApis";
import {
  getSelectionDetails,
  highlightGrammarMistake,
  removeDecoratorFromSelection,
} from "@/components/RichText/utils/helperFunction/richTextHelperFunction";
import { CorrectionConstant } from "@/components/RichText/utils/NotesContant";
import {
  getContentFromLocalStorage,
  getCorrectionListKey,
  saveContentOnLocalStorage,
  saveCorrectionList,
} from "@/components/RichText/utils/helperFunction/editorHelperFunction";

interface Props {}
const styleMap = {
  STRIKETHROUGH: {
    textDecoration: "line-through",
  },
  HIGHLIGHT: {
    backgroundColor: "#FFFF00",
  },
};

const WritingSection: FunctionComponent<Props> = ({}) => {
  const [editorState, setEditorState] = useState<EditorState>(() =>
    EditorState.createEmpty(decorator)
  );
  const [openNoteModal, setOpenNoteModal] = useState<boolean>(false);
  const [popperStatus, setPopperStatus] = useState(false);
  const [popperAnchorEl, setPopperAnchorEl] = useState<null | HTMLElement>(
    null
  );
  let selectedNoteRef: string = useRef("").current;
  const [selectedNote, setSelectedNote] = useState<SpellingMistakeDto | null>(
    null
  );
  const [teacherCorrectionList, setTeacherCorrectionList] = useState<
    Array<SpellingMistakeDto>
  >([]);
  const [apiCorrectionList, setApiCorrectionList] = useState<
    Array<SpellingMistakeDto>
  >([]);

  const updateEditorState = (editorState: EditorState) => {
    saveContentOnLocalStorage(editorState.getCurrentContent());
    setEditorState(editorState);
  };

  const updateApiCorrectionList = (correction: Array<SpellingMistakeDto>) => {
    saveCorrectionList(correction, CorrectionConstant.API_STORAGE_KEY);
    setApiCorrectionList(correction);
  };
  const updateTeacherCorrectionList = (
    correction: Array<SpellingMistakeDto>
  ) => {
    saveCorrectionList(correction, CorrectionConstant.TEACHER_STORAGE_KEY);
    setTeacherCorrectionList(correction);
  };

  const initiateCorrectionList = () => {
    const teacherCorrectionSaveData = getCorrectionListKey(
      CorrectionConstant.TEACHER_STORAGE_KEY
    );
    const apiCorrectionSaveData = getCorrectionListKey(
      CorrectionConstant.API_STORAGE_KEY
    );
    updateApiCorrectionList(apiCorrectionSaveData);
    updateTeacherCorrectionList(teacherCorrectionSaveData);
  };
  const initiateEditorState = () => {
    // const contentState =
    //   getContentFromLocalStorage() ||
    //   ContentState.createFromText(essayWithGrammarMistake);
    const contentState = ContentState.createFromText(essayWithGrammarMistake);
    const essayContent = EditorState.createWithContent(contentState, decorator);
    updateEditorState(essayContent);
  };

  const addEventListenerOnCorrectionNoteSpan = (
    event: any,
    noteSpanBlock: any
  ) => {
    const noteSpanId = noteSpanBlock.dataset.id;
    const currentNoteSpanData = [
      ...apiCorrectionList,
      ...teacherCorrectionList,
    ].find((note) => note.id == noteSpanId);
    if (selectedNoteRef && selectedNoteRef == noteSpanId) {
      setPopperAnchorEl(null);
      setSelectedNote(null);
      setPopperStatus(false);
      selectedNoteRef = "";
    } else if (currentNoteSpanData) {
      selectedNoteRef = currentNoteSpanData.id;
      setPopperAnchorEl(event.currentTarget);
      setSelectedNote(currentNoteSpanData);
      setPopperStatus(true);
    }
  };

  useEffect(() => {
    const noteSpanList: HTMLCollectionOf<any> =
      window.document.getElementsByClassName(
        CorrectionConstant.WRITING_NOTE_SPAN
      );
    for (let i = 0; i < noteSpanList.length; i++) {
      noteSpanList[i].addEventListener("click", (event: any) =>
        addEventListenerOnCorrectionNoteSpan(event, noteSpanList[i])
      );
    }
    return () => {
      for (let i = 0; i < noteSpanList.length; i++) {
        noteSpanList[i].removeEventListener("click", (event: any) =>
          addEventListenerOnCorrectionNoteSpan(event, noteSpanList[i])
        );
      }
    };
  }, [teacherCorrectionList, apiCorrectionList]);

  const getGrammarCheck = async () => {
    const text = editorState.getCurrentContent().getPlainText();
    const grammarCheck = await grammarCheckApi(text);
    if (grammarCheck.success && grammarCheck.data) {
      const grammarErrors = highlightGrammarMistake(
        editorState,
        grammarCheck.data.corrections
      );
      if (grammarErrors) {
        updateEditorState(grammarErrors.editor);
        updateApiCorrectionList(grammarErrors.grammarMistakesNotes);
      }
    }
  };

  useEffect(() => {
    initiateEditorState();
    // initiateCorrectionList();
  }, []);

  const openAddNotesModal = (event?: MouseEvent<any>) => {
    if (event) event.preventDefault();
    setOpenNoteModal(true);
  };

  const onConfirmAddNote = (correctionPayload: SpellingMistakeDto) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      CorrectionConstant.NOTE_ENTITY_TYPE,
      "MUTABLE",
      { correctionPayload: correctionPayload }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    let nextEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });
    nextEditorState = RichUtils.toggleLink(
      nextEditorState,
      nextEditorState.getSelection(),
      entityKey
    );
    updateTeacherCorrectionList([...teacherCorrectionList, correctionPayload]);
    setOpenNoteModal(false);
    updateEditorState(nextEditorState);
  };

  const removeCorrectionFromArray = (correctionId: string) => {
    const newApiCorrectionArray = apiCorrectionList.filter(
      (data) => data.id != correctionId
    );
    const teacherCorrectionArray = teacherCorrectionList.filter(
      (data) => data.id != correctionId
    );
    updateTeacherCorrectionList(teacherCorrectionArray);
    updateApiCorrectionList(newApiCorrectionArray);
  };
  const onDeleteCorrections = (correction: SpellingMistakeDto) => {
    debugger;
    const { startIndex, endIndex, startBlockId, endBlockId, id } = correction;
    const selectionState = editorState.getSelection().merge({
      anchorKey: startBlockId,
      focusKey: endBlockId,
      anchorOffset: startIndex,
      focusOffset: endIndex,
    });
    removeCorrectionFromArray(id);
    const newEditorState = removeDecoratorFromSelection(
      editorState,
      selectionState,
      CorrectionConstant.NOTE_ENTITY_TYPE
    );
    updateEditorState(newEditorState);
    setPopperStatus(false);
    setPopperAnchorEl(null);
  };

  return (
    <div className="p-8 flex justify-between w-full gap-4">
      <div className="w-2/3">
        <Paper>
          <div
            className="border rounded p-1 text-gray-600 border-gray-400"
            onContextMenu={openAddNotesModal}
          >
            <Editor
              editorState={editorState}
              onChange={updateEditorState}
              customStyleMap={styleMap}
            />
          </div>
        </Paper>
        <div className="flex gap-4 py-4">
          <Button
            onClick={openAddNotesModal}
            color="success"
            variant="outlined"
          >
            Add Correction Notes
          </Button>
          <Button onClick={getGrammarCheck} color="info" variant="outlined">
            Check Grammar
          </Button>
        </div>
      </div>
      <div className="w-1/3">
        <NoteList
          noteStorageList={[...apiCorrectionList, ...teacherCorrectionList]}
        />
      </div>
      {openNoteModal && (
        <AddNoteModal
          isOpen={openNoteModal}
          selectedText={getSelectionDetails(editorState)}
          onConfirmationClick={onConfirmAddNote}
          onClose={() => {
            setOpenNoteModal(false);
          }}
        />
      )}
      {selectedNote && popperStatus && (
        <NotePopper
          open={popperStatus}
          anchorEl={popperAnchorEl}
          noteData={selectedNote}
          onDelete={onDeleteCorrections}
        />
      )}
    </div>
  );
};
export default WritingSection;
