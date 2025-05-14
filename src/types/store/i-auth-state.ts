import IUser from "../i-user";


export default interface IAuthState {
    user: IUser | null;
    token: string | null;
}