// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

type Data = {
  success: boolean;
  data: any;
  message?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    if (req.method != "POST") {
      return res
        .status(400)
        .json({ success: false, message: "method not allowed", data: null });
    }
    const textMessage = req.body.text;
    let data = JSON.stringify({
      englishDialect: "indifferent",
      autoReplace: false,
      getCorrectionDetails: true,
      interfaceLanguage: "en",
      locale: "",
      language: "eng",
      text: textMessage,
      originalText: "",
      origin: "ginger.web",
      isHtml: false,
      IsUserPremium: true,
    });
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://orthographe.reverso.net/api/v1/Spelling/",
      headers: {
        authority: "orthographe.reverso.net",
        accept: "text/json",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
        "content-type": "application/*+json",
        "sec-ch-ua":
          '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
      },
      data: data,
    };
    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        res.json({ success: true, data: response.data, message: "" });
      })
      .catch(function (error) {
        console.log(error);
        res.json({ success: false, data: null, message: error });
      });
  } catch (e) {
    res.json({ success: false, data: null, message: "something went wrong" });
  }
}

// sample payload
const data = [{ text: "hello", isCorrect: true }];
