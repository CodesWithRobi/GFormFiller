import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import formReducer from "./form/formSlice"
import formValueReducer from "./form/formValueSlice"
import prefilledLinkReducer from "./form/prefilledLinkSlice"

export const store = configureStore({
  reducer: {
    form: formReducer,
    formValues: formValueReducer,
    prefilledLink: prefilledLinkReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
