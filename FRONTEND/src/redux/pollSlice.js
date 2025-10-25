import { createSlice } from "@reduxjs/toolkit";

const pollSlice = createSlice ({
    name: "poll",
    initialState: {
        createdPolls: [],
        selectedPoll: null,
        votedPolls: [],
    },
    reducers: {
        setCreatedPolls: (state, action) => {
            state.createdPolls = action.payload;
        },
        setSelectedPoll: (state, action) => {
            state.selectedPoll = action.payload;
        },
        setVotedPolls: (state, action) => {
            state.votedPolls = action.payload;
        }
    }
});

export const {setCreatedPolls, setSelectedPoll, setVotedPolls} = pollSlice.actions;
export default pollSlice.reducer;