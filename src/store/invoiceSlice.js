import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { invoiceAPI } from '../services/api';

export const searchInvoicesAsync = createAsyncThunk(
  'invoices/searchInvoices',
  async ({ searchParams, token }, { rejectWithValue }) => {
    try {
      const response = await invoiceAPI.searchInvoices(searchParams, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.userMessage || error.message || 'Fatura arama sırasında hata oluştu');
    }
  }
);

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState: {
    invoiceList: [],
    selectedInvoice: null,
    loading: false,
    error: null,
    pagination: {
      page: 0,
      size: 20,
      total: 0,
    },
  },
  reducers: {
    setSelectedInvoice: (state, action) => {
      state.selectedInvoice = action.payload;
    },
    clearSelectedInvoice: (state) => {
      state.selectedInvoice = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchInvoicesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchInvoicesAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        
        const responseData = action.payload;
        if (responseData && responseData.invoices) {
          state.invoiceList = responseData.invoices.content || [];
          state.pagination = {
            page: responseData.invoices.pageable?.pageNumber || 0,
            size: responseData.invoices.pageable?.pageSize || 20,
            total: responseData.invoices.totalElements || 0,
          };
        } else {
          state.invoiceList = [];
          state.pagination = { page: 0, size: 20, total: 0 };
        }
      })
      .addCase(searchInvoicesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedInvoice, clearSelectedInvoice, clearError } = invoiceSlice.actions;

export default invoiceSlice.reducer; 