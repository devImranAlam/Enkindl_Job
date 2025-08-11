// redux/jobSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axios';

export const fetchJobs = createAsyncThunk(
    'jobs/fetchJobs',
    async (query = '') => {
        const { data } = await axiosInstance.get(`/jobs?${query}`);
        return data;
    }
);

export const deleteJob = createAsyncThunk(
    'jobs/deleteJob',
    async (id) => {
        await axiosInstance.delete(`/jobs/${id}`);
        return id;
    }
);


const jobSlice = createSlice({
    name: 'jobs',
    initialState: {
        jobs: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearJobs: (state) => {
            state.jobs = [];
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchJobs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchJobs.fulfilled, (state, action) => {
                state.loading = false;
                state.jobs = action.payload;
            })
            .addCase(fetchJobs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { clearJobs } = jobSlice.actions;
export default jobSlice.reducer;