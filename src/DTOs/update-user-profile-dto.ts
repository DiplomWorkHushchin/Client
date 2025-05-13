export default interface UpdateUserProfileDTO {
    userName: string;
    phoneNumber?: string;
    firstName: string;
    lastName: string;
    fatherName?: string;
    gender?: string;
    dateOfBirth?: string;
    country?: string;
    city?: string;
}