//This about Generate Prefilled Link

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {AppThunk} from "../store"

interface PrefilledLinkState {
  prefilledLink: string;
}

const initialState: PrefilledLinkState = {
  prefilledLink: "",
}

const prefilledLinkSlice = createSlice({
  name: "prefilledLink",
  initialState,
  reducers: {
    setPrefilledLink: (state, action: PayloadAction<string>) => {
      state.prefilledLink = action.payload;
    }
  }
})

export const {setPrefilledLink} = prefilledLinkSlice.actions

export const generatePrefilledLink = (): AppThunk => (dispatch, getState) => {
  const state = getState();
  const url = state.form.url;
  const formValues = state.formValues.formValues;

  const baseUrl = `${url}?usp=pp_url`;
  const queryParams = Object.entries(formValues)
    .filter(([_, value]) => value !== '' && value.length > 0)
    .map(([fieldId, value]) => {
      if (Array.isArray(value)) {
        return value.map((v) => {
          if(v === 'Other')
            v = "__other_option__"
          return `${fieldId}=${encodeURIComponent(v)}`
        })
        .join('&');
      }
      else if(value === 'Other')
        value = "__other_option__"
      return `${fieldId}=${encodeURIComponent(value)}`;
    })
    .join('&');
  const prefilledLink = queryParams ? `${baseUrl}&${queryParams}` : baseUrl;

  dispatch(setPrefilledLink(prefilledLink));
};

export default prefilledLinkSlice.reducer;
