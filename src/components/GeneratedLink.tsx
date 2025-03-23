import { AppDispatch, RootState } from "../state/store";
import { useSelector, useDispatch } from "react-redux";
import { generatePrefilledLink } from "../state/form/prefilledLinkSlice";

const GeneratedLink: React.FC = () => {
  const prefilledLink = useSelector((state: RootState) => state.prefilledLink.prefilledLink)
  const dispatch = useDispatch<AppDispatch>()

  function generateLink() {
    dispatch(generatePrefilledLink())
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
