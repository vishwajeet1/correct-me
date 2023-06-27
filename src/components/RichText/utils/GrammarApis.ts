import axios from "axios";
import {
  ApiResponseDto,
  GrammarCorrectionDto,
} from "@/components/RichText/utils/NotesInterface";

export const grammarCheckApi = async (
  text: string
): Promise<ApiResponseDto<GrammarCorrectionDto>> => {
  try {
    const res = await axios.post("/api/spelling", { text });
    return res.data;
  } catch (e) {
    console.log("err", e);
    return { success: false, message: "something went wrong", data: null };
  }
};
