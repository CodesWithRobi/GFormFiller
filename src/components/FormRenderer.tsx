import React, { useState } from "react";
import type { FormField } from "./FormFetcher";

interface FormRendererProps {
  fields: FormField[];
  link: string;
}

const FormRenderer: React.FC<FormRendererProps> = ({ fields, link}) => {
  const [formValues, setFormValues] = useState<{ [key: string]: string | string[] }>({});
  const [prefilledLink, setPrefilledLink] = useState<string>("");

  const handleChange = (fieldId: string, value: string | string[], type: string) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldId]:
        type === "checkbox" && Array.isArray(prev[fieldId])
          ? (prev[fieldId] as string[]).includes(value as string)
            ? (prev[fieldId] as string[]).filter((v) => v !== value)
            : [...(prev[fieldId] as string[]), value as string]
          : value,
    }));
  };

  const generateLink = () => {
    const baseUrl = `${link}?usp=pp_url`;
    const queryParams = Object.entries(formValues)
      .filter(([_, value]) => value !== "" && value.length > 0)
      .map(([fieldId, value]) => {
        if (Array.isArray(value)) {
          return value.map((v) => `${fieldId}=${encodeURIComponent(v)}`).join("&");
        }
        return `${fieldId}=${encodeURIComponent(value)}`;
      })
      .join("&");
    setPrefilledLink(queryParams ? `${baseUrl}&${queryParams}` : baseUrl);
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            value={(formValues[field.id] as string) || ""}
            onChange={(e) => handleChange(field.id, e.target.value, field.type)}
          />
        );
      case "textarea":
        return (
          <textarea
            value={(formValues[field.id] as string) || ""}
            onChange={(e) => handleChange(field.id, e.target.value, field.type)}
          />
        );
      case "radio":
        return (
          <div>
            {field.options?.map((option) => (
              <label key={option}>
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={formValues[field.id] === option}
                  onChange={(e) => handleChange(field.id, e.target.value, field.type)}
                />
                {option}
              </label>
            ))}
          </div>
        );
      case "checkbox":
        return (
          <div>
            {field.options?.map((option) => (
              <label key={option}>
                <input
                  type="checkbox"
                  name={field.id}
                  value={option}
                  checked={
                    Array.isArray(formValues[field.id]) &&
                    (formValues[field.id] as string[]).includes(option)
                  }
                  onChange={(e) => handleChange(field.id, e.target.value, field.type)}
                />
                {option}
              </label>
            ))}
          </div>
        );
      case "select":
        return (
          <select
            value={(formValues[field.id] as string) || ""}
            onChange={(e) => handleChange(field.id, e.target.value, field.type)}
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "date":
        return (
          <input
            type="date"
            value={(formValues[field.id] as string) || ""}
            onChange={(e) => handleChange(field.id, e.target.value, field.type)}
          />
        );
      case "time":
        return (
          <input
            type="time"
            value={(formValues[field.id] as string) || ""}
            onChange={(e) => handleChange(field.id, e.target.value, field.type)}
          />
        );
      default:
        return <p>Unsupported field type: {field.type}</p>;
    }
  };

  return (
    <div>
      {fields.length > 0 ? (
        fields.map((field) => (
          <div key={field.id}>
            <label>
              {field.label}
              {field.required && <span> *</span>}
            </label>
            {renderField(field)}
          </div>
        ))
      ) : (
        <p>No fields found yet.</p>
      )}
      <button onClick={generateLink}>Generate Prefilled Link</button>
      {prefilledLink && (
        <div>
          <p>Prefilled Link:</p>
          <a href={prefilledLink} target="_blank" rel="noopener noreferrer">
            {prefilledLink}
          </a>
        </div>
      )}
    </div>
  );
};

export default FormRenderer;
