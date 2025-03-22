// This to manage user inputs in form

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface formValueState {
  formValues: { [key: string]: string | string[] };
}

const initialState: formValueState = {
  formValues: {},
}

const formValueSlice = createSlice({
  name: "formValues",
  initialState,
  reducers: {
    setFormValues : (state, action: PayloadAction<{fieldId: string, value: string | string[], type: string}>) => {
      const { fieldId, value, type } = action.payload;
      if (type === 'checkbox' || type === 'checkbox-grid') {
        const current = Array.isArray(state.formValues[fieldId])
          ? (state.formValues[fieldId] as string[])
          : [];
        state.formValues[fieldId] = current.includes(value as string)
          ? current.filter((v) => v !== value)
          : [...current, value as string];
      } else {
        state.formValues[fieldId] = value;
      }
    },
  }
})

export const {setFormValues} = formValueSlice.actions
export default formValueSlice.reducer
