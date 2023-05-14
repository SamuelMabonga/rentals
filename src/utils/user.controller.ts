import UserModel, { IUser } from "@/models/user.model";
import connectDB from "./db";
import bcryptjs from 'bcryptjs';



type UserX = Omit<IUser,  | 'createdAt' | 'updatedAt' >;

export const createUser = async (user: UserX) => {
    console.log('Request to add user: ', user)
    console.log(await connectDB());
    const userAdded: UserX = {
        ...user,
        password: bcryptjs.hashSync(user.password, 10),
        userType: 'PATIENT',
        age: 3
    }
    console.log('Request to add user: ', userAdded);
    const finduser = await UserModel.findOne({
        email: userAdded.email
    });
    if (finduser) return new Error("User Found, Change Email");
    const newUser = await UserModel.create(userAdded);
    return newUser;
}

export const getUserByEmail = async (email: string) => {
    const user: IUser | null = await UserModel.findOne({
        email
    });
    if(!user) throw new Error("No User Found");
    return user;
}