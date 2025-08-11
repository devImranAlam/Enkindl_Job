import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../utils/axios';

// Fetch all applications for recruiter
export const fetchRecruiterApplications = createAsyncThunk(
    'applications/fetchRecruiter',
    async () => {
        const res = await axiosInstance.get('/apply/recruiter?recruiter=true');
        return res.data;
    }
);
// Fetch all applications for admin
export const fetchAdminApplications = createAsyncThunk(
    'applications/fetchAdmin',
    async () => {
        const res = await axiosInstance.get('/apply/admin?admin=true');
        return res.data;
    }
);

// Update application status
export const updateApplicationStatus = createAsyncThunk(
    'applications/updateStatus',
    async ({ id, status }) => {
        await axiosInstance.patch(`/apply/${id}/status`, { status });
        return { id, status };
    }
);

// Fetch candidate's own applications
export const fetchUserApplications = createAsyncThunk(
    'applications/fetchUser',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get('/apply/me?user=true');
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || 'Failed to load applications');
        }
    }
);


const applicationSlice = createSlice({
    name: 'applications',
    initialState: {
        applications: [],
        userApplications: [], // for candidate 
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRecruiterApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRecruiterApplications.fulfilled, (state, action) => {
                state.loading = false;
                state.applications = action.payload;
            })
            .addCase(fetchRecruiterApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // same for admin
            .addCase(fetchAdminApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminApplications.fulfilled, (state, action) => {
                state.loading = false;
                state.applications = action.payload;
            })
            .addCase(fetchAdminApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(updateApplicationStatus.fulfilled, (state, action) => {
                const { id, status } = action.payload;
                const index = state.applications.findIndex((app) => app._id === id);
                if (index !== -1) {
                    state.applications[index].status = status;
                }
            })
            // For user applications
            .addCase(fetchUserApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserApplications.fulfilled, (state, action) => {
                state.loading = false;
                state.userApplications = action.payload;
            })
            .addCase(fetchUserApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    },
});

export default applicationSlice.reducer;