import { useState } from "react";

interface GeneratedLinkProps {
  link: string;
  formValues: { [key: string]: string | string[] };
}

const GeneratedLink: React.FC<GeneratedLinkProps> = ({ link, formValues }) => {
  const [prefilledLink, setPrefilledLink] = useState<string>("");
  function generateLink() {
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
  }

  return (
    <>
      <button onClick={generateLink}>Generate Prefilled Link</button>
      {prefilledLink && (
        <div>
          <p>Prefilled Link:</p>
          <a href={prefilledLink} target="_blank" rel="noopener noreferrer">
            {prefilledLink}
          </a>
        </div>
      )}
    </>
  )

}

export default GeneratedLink
