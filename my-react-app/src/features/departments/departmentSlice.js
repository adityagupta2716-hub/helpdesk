import {
    createSlice,
    createAsyncThunk
} from "@reduxjs/toolkit";

import {
    getDepartments
} from "./departmentAPI";
import { createDepartment, updateDepartment} from "./departmentAPI"

export const fetchDepartments=
createAsyncThunk(
    "departments/fetchDepartments",
    async(_,thunkAPI)=>{
        try{
            return await getDepartments();
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch departments"
            );
        }
    }
);

export const addDepartment=createAsyncThunk("departments/addDepartment",
    async(departmentData,thunkAPI)=>{
        try{
            return await createDepartment(
                departmentData
            );
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to create department"
            );
        }
    }
);

export const updateDepartmentThunk=createAsyncThunk("departments/updateDepartment",
    async(
        {
            departmentId,
            departmentData
        },
        thunkAPI
    )=>{
        try{
            return await updateDepartment(departmentId,departmentData);
        }
        catch(error)
        {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to update department"
            );
        }
    }
);

const initialState={
    departments:[],
    loading:false,
    error:null
};

const departmentSlice=createSlice({
    name:"departments",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(
            fetchDepartments.pending,
            (state)=>{
                state.loading=true;
                state.error=null;
            }
        );

        builder.addCase(
            fetchDepartments.fulfilled,
            (state,action)=>{
                state.loading=false;
                state.departments=
                action.payload.departments;
            }
        );

        builder.addCase(
            fetchDepartments.rejected,
            (state,action)=>{
                state.loading=false;
                state.error=action.payload;
            }
        );
        builder.addCase(
            addDepartment.fulfilled,
            (state,action)=>{
                state.departments.push(action.payload)
            }
        );
        builder.addCase(
            updateDepartmentThunk.pending,
            (state)=>{
                state.loading=true;
            }
        );

        builder.addCase(
            updateDepartmentThunk.fulfilled,
            (state)=>{
                state.loading=false;
            }
        );

        builder.addCase(
            updateDepartmentThunk.rejected,
            (state,action)=>{
                state.loading=false;
                state.error=action.payload;
            }
        );
            }
        });

export default departmentSlice.reducer;