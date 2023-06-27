import { ChangeEvent, FunctionComponent, useState } from "react";
import {
  MessageTypeDto,
  SelectionInfoDto,
  SpellingMistakeDto,
} from "@/components/RichText/utils/NotesInterface";
import { Button, Input, Modal, Paper } from "@mui/material";
import DropDown from "@/components/RichText/Common/DropDown";
import { noteTypeDropDownItems } from "@/components/RichText/utils/NotesContant";

interface Props {
  isOpen: boolean;
  selectedText: SelectionInfoDto;
  onConfirmationClick: (payload: SpellingMistakeDto) => void;
  onClose: () => void;
}

const AddNoteModal: FunctionComponent<Props> = ({
  isOpen,
  selectedText,
  onClose,
  onConfirmationClick,
}) => {
  const [messageType, setMessageType] = useState<MessageTypeDto>(
    MessageTypeDto.Spelling
  );
  const [correctionText, setCorrectionText] = useState<string>("");
  const [shortDescription, setShortDescription] = useState<string>("");
  const [longDescription, setLongDescription] = useState<string>("");

  const handleSubmit = () => {
    const payload: SpellingMistakeDto = {
      id: selectedText.id,
      endBlockId: selectedText.endBlockKey,
      endIndex: selectedText.endOffset,
      mistakeText: selectedText.text,
      startBlockId: selectedText.startBlockKey,
      startIndex: 0,
      type: messageType,
      shortDescription: shortDescription,
      longDescription: longDescription,
      correctionText: correctionText,
    };
    onConfirmationClick(payload);
  };

  const inputArrayList: Array<{
    id: number;
    label: string;
    onChange: (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
    placeholder: string;
    value: string;
  }> = [
    {
      id: 1,
      label: "Correct Sentence",
      placeholder: "Enter Correct sentence",
      value: correctionText,
      onChange: (e) => setCorrectionText(e.target.value),
    },
    {
      id: 2,
      label: "Short Description",
      placeholder: "Enter Short Description of Correction",
      value: shortDescription,
      onChange: (e) => setShortDescription(e.target.value),
    },
    {
      id: 3,
      label: "Long Description",
      placeholder: "Enter Long Description of Correction",
      value: longDescription,
      onChange: (e) => setLongDescription(e.target.value),
    },
  ];

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="w-full flex justify-center h-full items-center">
        <Paper className="bg-white min-w-[700px]">
          <div className="p-4 border-gray-400 font-bold rounded bg-red-100 text-red-900 flex justify-between items-center">
            <div>{selectedText.text}</div>
          </div>
          <div className="p-4">
            <DropDown
              title="error type"
              dropDownArray={noteTypeDropDownItems}
              selectedItems={messageType}
              handleClick={(e) => {
                const value = e.target.value as MessageTypeDto;
                setMessageType(MessageTypeDto[value]);
              }}
            />
          </div>
          {inputArrayList.map((input) => (
            <div className="w-full p-4" key={input.id}>
              <div className="text-sm text-gray-600 py-1">{input.label}</div>
              <Input
                value={input.value}
                onChange={input.onChange}
                className="rounded text-gray-600 p-1"
                placeholder={input.placeholder}
                fullWidth
              />
            </div>
          ))}
          <div className="flex justify-center gap-4 pb-4">
            <Button variant="outlined" color="success" onClick={handleSubmit}>
              Confirm
            </Button>
            <Button variant="outlined" color="error" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </Paper>
      </div>
    </Modal>
  );
};
export default AddNoteModal;
