import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice ({
    name: "auth",
    initialState: {
        voter:{},
        admin:{}
    },
    reducers: {
        setAdmin: (state, action) => {
            state.admin = action.payload;
        },
        setVoter: (state, action) => {
            state.voter = action.payload;
        }
    }
});

export const {setAdmin, setVoter} = authSlice.actions;
export default authSlice.reducer;