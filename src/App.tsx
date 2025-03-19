// src/App.tsx
import { useState, FormEvent } from "react";
import "./App.css";
import * as cheerio from "cheerio";
import axios from "axios";

type FormField = {
  id: string;
  type: "text" | "option" | "textarea";
  label: string;
};

function App() {
  const [link, setLink] = useState<string>("");
  const [fields, setFields] = useState<FormField[]>([]);

  const fetchFormField = async (url: string) => {
    try {
      const response = await axios.get("http://localhost:3000/fetch-form", {
        params: { url }, // Pass the URL as a query parameter
      });

      const html = response.data;
      const $ = cheerio.load(html);

      const extractedFields: FormField[] = [];
      
      // Parse text inputs and textareas
      $('input[type="text"], textarea').each((i, element) => {
        const isTextarea = $(element).is("textarea");
        const name = $(element).attr("name") || `field-${i}`;
        if (name.startsWith("entry.")) {
          const label = $(element)
            .closest(".Qr7Oae")
            .find(".M7eMe")
            .text()
            .trim() || `Field ${i + 1}`;

          extractedFields.push({
            id: name,
            type: isTextarea ? "textarea" : "text",
            label,
          });
        }
      });

      // Optionally parse hidden inputs if needed
      $('div[jsname="o6bZLc"] input[type="hidden"]').each((i, element) => {
        const name = $(element).attr("name");
        if (name && name.startsWith("entry.")) {
          const label = $(element)
            .closest(".Qr7Oae")
            .find(".M7eMe")
            .text()
            .trim() || `Field ${i + 1}`;

          extractedFields.push({
            id: name,
            type: "text", // Assuming hidden inputs relate to text fields
            label,
          });
        }
      });

      setFields(extractedFields);
    } catch (error) {
      console.error("Error fetching form:", error);
      setFields([]); // Reset fields on error
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page reload
    if (link) {
      fetchFormField(link); // Use the input link
    } else {
      console.log("No link provided, using default");
      fetchFormField("https://docs.google.com/forms/d/e/1FAIpQLSeafbtS_ljnaqFPncoVR1eSbdBxIKcViEXmvo62GzOdAEnktA/viewform");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="docs.google.com"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>

      <h2>Below here are the fields</h2>
      {fields.length > 0 ? (
        <ul>
          {fields.map((field) => (
            <li key={field.id}>
              <strong>{field.label}</strong> (ID: {field.id}, Type: {field.type})
            </li>
          ))}
        </ul>
      ) : (
        <p>No fields found yet.</p>
      )}
    </>
  );
}

export default App;
