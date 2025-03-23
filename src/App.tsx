import { useState } from "react";
import "./App.css";
import FormFetcher from "./components/FormFetcher";
import FormRenderer from "./components/FormRenderer";

import type { FormField } from "./components/FormFetcher";

function App() {
  const [fields, setFields] = useState<FormField[]>([]);
  const [link, setLink] = useState<string>("");

  return (
    <div>
      <FormFetcher />
      <FormRenderer fields={fields} link={link} />
    </div>
  );
}

export default App;
