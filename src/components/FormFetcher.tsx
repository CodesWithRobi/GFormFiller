import React, { FormEvent } from "react";
import * as cheerio from "cheerio";
import axios from "axios";

export type FormField = {
  id: string;
  label: string;
  type: string;
  options?: string[];
  required: boolean;
};

interface FormFetcherProps {
  onFieldsFetched: (fields: FormField[]) => void;
  link: string;
  setLink: React.Dispatch<React.SetStateAction<string>>;
}

const FormFetcher: React.FC<FormFetcherProps> = ({ onFieldsFetched, link, setLink }) => {
  const fetchFormField = async (url: string) => {
    try {
      const response = await axios.get("http://localhost:3000/fetch-form", {
        params: { url },
      });

      const html: string = response.data;
      const $ = cheerio.load(html);

      const scriptText = $('script:contains("FB_PUBLIC_LOAD_DATA_")').html();
      if (!scriptText) {
        throw new Error("Could not find FB_PUBLIC_LOAD_DATA_ in the HTML");
      }

      const match = scriptText.match(/var FB_PUBLIC_LOAD_DATA_ = (\[[\s\S]*?\]);/);
      if (!match) {
        throw new Error("Could not extract FB_PUBLIC_LOAD_DATA_ array");
      }

      const dataStr = match[1];
      const data = JSON.parse(dataStr);

      const fieldsData = data[1][1];
      if (!fieldsData || !Array.isArray(fieldsData)) {
        throw new Error("Invalid field data structure in FB_PUBLIC_LOAD_DATA_");
      }

      const qr7OaeDivs = $(".Qr7Oae");

      const extractedFields: FormField[] = fieldsData.flatMap((field: any, index: number) => {
        const label = field[1];
        const typeCode = field[3];
        const entryData = field[4][0];
        const isRequired = $(qr7OaeDivs[index]).find(".vnumgf").length > 0;

        if (typeCode === 7) {
          const gridType = entryData[11][0]; // 0 for radio, 1 for checkbox
          const fieldType = gridType === 0 ? "radio" : "checkbox";
          const columnOptions = entryData[1].map((col: any) => col[0])
          return field[4].map((row: any) => ({
            id: `entry.${row[0]}`,
            label: `${label} - ${row[3][0]}`,
            type: fieldType,
            options: columnOptions,
            required: isRequired,
          }));
        } else {
          const entryId = `entry.${entryData[0]}`;
          let fieldType: string;
          let options: string[] | undefined;

          switch (typeCode) {
            case 0:
              fieldType = "text";
              break;
            case 1:
              fieldType = "textarea";
              break;
            case 2:
              fieldType = "radio";
              if (entryData[1]) {
                options = entryData[1].map((opt: any) => (opt[0] === "" ? "Other" : opt[0]));
              }
              break;
            case 3:
              fieldType = "select";
              if (entryData[1]) {
                options = entryData[1].map((opt: any) => opt[0]);
              }
              break;
            case 4:
              fieldType = "checkbox";
              if (entryData[1]) {
                options = entryData[1].map((opt: any) => (opt[0] === "" ? "Other" : opt[0]));
              }
              break;
            case 5:
              fieldType = "scale";
              if (entryData[1]) {
                options = entryData[1].map((opt: any) => opt[0]);
              }
              break;
            case 9:
              fieldType = "date";
              break;
            case 10:
              fieldType = "time";
              break;
            case 13:
              fieldType = "file";
              break;
            case 18:
              fieldType = "rating";
              if (entryData[1]) {
                options = entryData[1].map((opt: any) => opt[0]);
              }
              break;
            default:
              fieldType = "unknown";
              console.warn(`Unknown type code: ${typeCode} for field: ${label}`);
          }

          return [{
            id: entryId,
            label,
            type: fieldType,
            options,
            required: isRequired,
          }];
        }
      });

      onFieldsFetched(extractedFields);
    } catch (error) {
      console.error("Error fetching form:", error);
      onFieldsFetched([]);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (link) {
      fetchFormField(link);
    } else {
      console.log("No link provided, using default");
      fetchFormField("https://docs.google.com/forms/d/e/1FAIpQLSeafbtS_ljnaqFPncoVR1eSbdBxIKcViEXmvo62GzOdAEnktA/viewform");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Enter Google Form URL"
      />
      <button type="submit">Fetch Fields</button>
    </form>
  );
};

export default FormFetcher;
