// redux/reducers/formSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface FormState {
  forms: any[];
  loading: boolean;
  error: string | null;
}

const initialState: FormState = {
  forms: [],
  loading: false,
  error: null,
};

// Create Form
export const createForm = createAsyncThunk(
  'forms/createForm',
  async (
    { title, questions, token }: { title: string; questions: any[]; token: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/forms`,
        { title, questions },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Form creation failed');
    }
  }
);

// Fetch Forms
export const fetchForms = createAsyncThunk(
  'forms/fetchForms',
  async (token: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/forms`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API response data:", res.data); // Debug log
       return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Fetching forms failed');
    }
  }
);

const formSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Create Form
    builder.addCase(createForm.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createForm.fulfilled, (state, action) => {
      state.loading = false;

      // ✅ Ensure state.forms is always an array
      if (!Array.isArray(state.forms)) {
        state.forms = [];
      }

      state.forms.push(action.payload);
    });
    builder.addCase(createForm.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Forms
    builder.addCase(fetchForms.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchForms.fulfilled, (state, action) => {
      state.loading = false;

      // ✅ Normalize payload to array
      state.forms = Array.isArray(action.payload)
        ? action.payload
        : action.payload
        ? [action.payload]
        : [];
    });
    builder.addCase(fetchForms.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default formSlice.reducer;
