import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState, useAppSelector } from "../store";
import { CodeState, LangEnum, CodeResponse, CodeSuccess } from "./types/code";
import { AuthError } from "./types/auth";
import { AxiosError } from "axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const initialState: CodeState = {
  lang: LangEnum.cpp,
  source: "",
  input: "",
  output: "",
  loading: false,
  message: null,
  error: "",
};

export const runCodeAsyncThunk = createAsyncThunk<
  CodeSuccess,
  null,
  { rejectValue: AuthError }
>("code/run", async (_, thunkApi) => {
  const codeState = useAppSelector(codeSelector);
  const axiosPrivate = useAxiosPrivate();

  try {
    const response = await axiosPrivate.post("/users/submit", {
      lang: codeState.lang.valueOf(),
      src: codeState.source,
    });

    const data = response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    const err = error as AxiosError<AuthError>;
    return thunkApi.rejectWithValue({
      message: err?.response?.data?.message ?? "Error in runCodeAsyncThunk",
    });
  }
});

export const codeSlice = createSlice({
  initialState: initialState,
  name: "code",
  reducers: {
    setSource: (state, action: PayloadAction<string>) => {
      state.source = action.payload;
    },
    setLang: (state, action: PayloadAction<LangEnum>) => {
      console.log(action.payload);
      state.lang = action.payload;
    },
    setInput: (state, action: PayloadAction<string>) => {
      state.input = action.payload;
    },
    setOutput: (state, action: PayloadAction<string>) => {
      state.output = action.payload;
    },
    toggleLoading: (state, action) => {
      state.loading = !state.loading;
    },
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
  },

  extraReducers(builder) {
    builder.addCase(runCodeAsyncThunk.pending, (state, { payload }) => {
      state.loading = true;
      console.log(payload);
    });
    builder.addCase(runCodeAsyncThunk.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.submissionId = payload.submissionId;
    });
    builder.addCase(runCodeAsyncThunk.rejected, (state, { payload }) => {
      state.loading = false;
      console.log(payload?.message);
    });
  },
});
export const codeSelector = (state: RootState) => state.codeReducer;
export const codeAction = codeSlice.actions;
export const codeReducer = codeSlice.reducer;
