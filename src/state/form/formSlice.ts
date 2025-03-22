// This to handle form url and fetching part of it
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FormField } from "../../components/FormFetcher";

interface FormState {
  url: string;
  fields: FormField[];
}

const initialState: FormState = {
  url: '',
  fields: [],
}

 const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setUrl: (state, action: PayloadAction<string>) => {
      state.url = action.payload;
    },
    setFields: (state, action: PayloadAction<FormField[]>) => {
      state.fields = action.payload;
    },
  }
})

export const {setUrl, setFields} = formSlice.actions
export default formSlice.reducer
