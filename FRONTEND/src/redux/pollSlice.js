import { createSlice } from "@reduxjs/toolkit";

const pollSlice = createSlice ({
    name: "poll",
    initialState: {
        createdPolls:null,
        selectedPoll:null
    },
    reducers: {
        setCreatedPolls: (state, action) => {
            state.createdPolls = action.payload;
        },
        setSelectedPoll: (state, action) => {
            state.selectedPoll = action.payload;
        }
    }
});

export const {setCreatedPolls, setSelectedPoll} = pollSlice.actions;
export default pollSlice.reducer;