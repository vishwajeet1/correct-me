import React, { FunctionComponent } from "react";
import { Box, Fade, Popper } from "@mui/material";
import { SpellingMistakeDto } from "@/components/RichText/utils/NotesInterface";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";

interface Props {
  open: boolean;
  anchorEl: null | HTMLElement;
  noteData: SpellingMistakeDto;
  onDelete: (noteData: SpellingMistakeDto) => void;
}

const NotePopper: FunctionComponent<Props> = ({
  open,
  anchorEl,
  noteData,
  onDelete,
}) => {
  const {
    id,
    type,
    shortDescription,
    correctionText,
    mistakeText,
    longDescription,
  } = noteData;
  return (
    <Popper id={id} open={open} anchorEl={anchorEl} transition className="z-10">
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          <div className="bg-white border border-gray-300 rounded z-[99] min-w-[200px] p-4">
            <div className="flex justify-between items-center">
              <div className="text-gray-600 text-sm font-bold">{type}</div>
              <DeleteForeverRoundedIcon
                color="error"
                cursor="pointer"
                onClick={() => onDelete(noteData)}
              />
            </div>
            <div className="w-full w-full h-[1px] bg-gray-200 mb-4" />
            <div className="flex justify-start items-center gap-2 text-[18px]">
              <div className="line-through font-bold font-bold text-gray-500">
                {mistakeText}
              </div>
              <div className="font-bold text-gray-900">→</div>
              <div className="font-bold text-blue-900">{correctionText}</div>
            </div>
            <div className="text-gray-500 text-xs pt-4">{shortDescription}</div>
            <div className="text-gray-500 text-sm pt-2">{longDescription}</div>
          </div>
        </Fade>
      )}
    </Popper>
  );
};
export default NotePopper;
