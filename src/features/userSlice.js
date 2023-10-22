import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    loginUser: localStorage.getItem("LinkedInUser") ? JSON.parse(localStorage.getItem("LinkedInUser")) : null,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        userdata: (state, action) => {
            state.loginUser = action.payload
        },
    },
})

export const { userdata } = userSlice.actions

export default userSlice.reducer