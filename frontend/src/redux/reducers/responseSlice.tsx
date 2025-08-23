// redux/reducers/responseSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface ResponseState {
  responses: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ResponseState = {
  responses: [],
  loading: false,
  error: null,
};

// Fetch responses for a given form
export const fetchResponses = createAsyncThunk(
  'responses/fetchResponses',
  async (formId: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/responses/${formId}`
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Fetching responses failed');
    }
  }
);

const responseSlice = createSlice({
  name: 'responses',
  initialState,
  reducers: {
    clearResponses: (state) => {
      state.responses = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchResponses.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchResponses.fulfilled, (state, action) => {
      state.loading = false;
      state.responses = Array.isArray(action.payload) ? action.payload : [];
    });
    builder.addCase(fetchResponses.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearResponses } = responseSlice.actions;
export default responseSlice.reducer;
