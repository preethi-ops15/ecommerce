import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import { fetchAllUsers, fetchLoggedInUserById, updateUserById } from './UserApi'

const initialState={
    status:"idle",
    users: [],
    userInfo:null,
    errors:null,
    successMessage:null
}

export const fetchLoggedInUserByIdAsync=createAsyncThunk('user/fetchLoggedInUserByIdAsync',async(id)=>{
    const userInfo=await fetchLoggedInUserById(id)
    return userInfo
})
export const updateUserByIdAsync=createAsyncThunk('user/updateUserByIdAsync',async(update)=>{
    const updatedUser=await updateUserById(update)
    return updatedUser
})

export const fetchAllUsersAsync = createAsyncThunk(
  'user/fetchAllUsers',
  async () => {
    const response = await fetchAllUsers();
    return response;
  }
);

const userSlice=createSlice({
    name:"userSlice",
    initialState:initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
            .addCase(fetchLoggedInUserByIdAsync.pending,(state)=>{
                state.status='pending'
            })
            .addCase(fetchLoggedInUserByIdAsync.fulfilled,(state,action)=>{
                state.status='fulfilled'
                state.userInfo=action.payload
            })
            .addCase(fetchLoggedInUserByIdAsync.rejected,(state,action)=>{
                state.status='rejected'
                state.errors=action.error
            })

            .addCase(updateUserByIdAsync.pending,(state)=>{
                state.status='pending'
            })
            .addCase(updateUserByIdAsync.fulfilled,(state,action)=>{
                state.status='fulfilled'
                state.userInfo=action.payload
            })
            .addCase(updateUserByIdAsync.rejected,(state,action)=>{
                state.status='rejected'
                state.errors=action.error
            })
            .addCase(fetchAllUsersAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllUsersAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.users = action.payload;
            })
            .addCase(fetchAllUsersAsync.rejected, (state, action) => {
                state.status = 'idle';
                state.errors = action.error;
            })
    }
})

// exporting selectors
export const selectUserStatus=(state)=>state.userSlice?.status || 'idle'
export const selectUserInfo=(state)=>state.userSlice?.userInfo || null
export const selectUserErrors=(state)=>state.userSlice?.errors || null
export const selectUserSuccessMessage=(state)=>state.userSlice?.successMessage || null
export const selectUsers = (state) => state.userSlice?.users || [];
export const selectUsersStatus = (state) => state.userSlice?.status || 'idle';


export default userSlice.reducer