import { createSlice } from "@reduxjs/toolkit";

const pollSlice = createSlice({
    name: "poll",
    initialState: {
        createdPolls: [],
        selectedPoll: null,
        votedPolls: [],
        availablePolls: []
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
        },
        setAvailablePolls: (state, action) => {
            state.availablePolls = action.payload;
        }
    }
});

export const { setCreatedPolls, setSelectedPoll, setVotedPolls, setAvailablePolls } = pollSlice.actions;
export default pollSlice.reducer;