import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IUser from "@/intefaces/i-user";
import IAuthState from "@/intefaces/store/i-auth-state";

const initialState: IAuthState = {
    user: null,
    token: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginUser(state, action: PayloadAction<IAuthState>) {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        logoutUser(state) {
            state.user = null;
            state.token = null;
        },
        updateUser(state, action: PayloadAction<IAuthState>) {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        updateUserData(state, action: PayloadAction<IUser>) {
            state.user = action.payload;
        }
    },
});

export const { loginUser, logoutUser, updateUser, updateUserData } = userSlice.actions;
export default userSlice.reducer;
