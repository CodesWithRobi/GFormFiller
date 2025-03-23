import type { FormField } from "./FormFetcher";
import GeneratedLink from "./GeneratedLink";
import { AppDispatch, RootState } from "../state/store";
import { useSelector, useDispatch } from "react-redux";
import { setFormValues } from "../state/form/formValueSlice";

const FormRenderer: React.FC = () => {
  const fields = useSelector((state: RootState) =>  state.form.fields )
  const formValues = useSelector((state: RootState) => state.formValues.formValues)
  const link = useSelector((state: RootState) =>  state.form.url ) //To be removed
  const dispatch = useDispatch<AppDispatch>()

  const handleChange = (fieldId: string, value: string | string[], type: string) => {
    dispatch(setFormValues({fieldId, value, type}))
    
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
      case "scale":
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
      case "rating":
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
      case "radio-grid":
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
      case "checkbox-grid":
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
      <GeneratedLink link={link} formValues={formValues} />
    </div>
  );
};

export default FormRenderer;
