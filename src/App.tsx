import { useState } from "react";
import "./App.css";
import FormFetcher from "./components/FormFetcher";
import FormRenderer from "./components/FormRenderer";

import type { FormField } from "./components/FormFetcher";

function App() {
  const [fields, setFields] = useState<FormField[]>([]);
  const [link, setLink] = useState<string>("");

  const handleFieldsFetched = (fetchedFields: FormField[]) => {
    setFields(fetchedFields);
    console.log(fields);
  };

  return (
    <div>
      <FormFetcher onFieldsFetched={handleFieldsFetched} link={link} setLink={setLink} />
      <FormRenderer fields={fields} link={link} />
    </div>
  );
}

export default App;
