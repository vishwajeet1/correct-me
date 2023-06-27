import { FunctionComponent } from "react";
import { SpellingMistakeDto } from "@/components/RichText/utils/NotesInterface";
import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface Props {
  noteStorageList: Array<SpellingMistakeDto>;
}

const NoteList: FunctionComponent<Props> = ({ noteStorageList }) => {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
  return (
    <div>
      <div className="text-gray-600 font-bold">Corrections</div>
      {noteStorageList.map((notes) => (
        <Accordion
          key={notes.id}
          expanded={expanded === notes.id}
          onChange={handleChange(notes.id)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <div className="flex justify-between w-full w-[70%]">
              <div className="font-bold text-gray-800 text-sm">
                <span className="line-through text-gray-500">
                  {notes.mistakeText}
                </span>{" "}
                →{" "}
                <span className="text-blue-900 font-bold">
                  {notes.correctionText}
                </span>
              </div>
              <div className="pl-8 text-gray-600 text-xs">{notes.type}</div>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <div className="border-t border-gray-200 pt-4 text-gray-500 text-sm">
              {notes.shortDescription}
            </div>
            <div className="pt-4 text-gray-500 text-md">
              {notes.longDescription}
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};
export default NoteList;
