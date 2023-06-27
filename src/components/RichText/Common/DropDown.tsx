import { FunctionComponent } from "react";
import { DropDownDto } from "@/components/RichText/utils/NotesInterface";
import { InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

interface Props {
  dropDownArray: Array<DropDownDto>;
  selectedItems: string;
  handleClick: (event: SelectChangeEvent) => void;
  title: string;
}

const DropDown: FunctionComponent<Props> = ({
  dropDownArray,
  selectedItems,
  handleClick,
  title,
}) => {
  return (
    <div className="w-full">
      <InputLabel>{title}</InputLabel>
      <Select
        value={selectedItems}
        label={title}
        onChange={handleClick}
        size="small"
        fullWidth
      >
        {dropDownArray.map((data) => (
          <MenuItem key={data.value} value={data.value}>
            {data.label}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};
export default DropDown;
