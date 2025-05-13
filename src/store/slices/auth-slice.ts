import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IUser from "@/types/i-user";
import IAuthState from "@/types/store/i-auth-state";

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
        },
        setToken(state, action: PayloadAction<string>) {
            state.token = action.payload;
        }
    },
});

export const { loginUser, logoutUser, updateUser, updateUserData, setToken } = userSlice.actions;
export default userSlice.reducer;
