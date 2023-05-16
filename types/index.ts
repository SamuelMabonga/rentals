export interface IUser {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  national_id: string;
  verified: boolean;
}

export interface LoginUserParams {
  email: string;
  password: string;
}
