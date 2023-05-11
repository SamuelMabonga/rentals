import { compare } from "bcryptjs";
import { connectToMongoDB } from "lib/mongodb";
import User from "models/user";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
        password: { label: "Password", type: "password" },
        async authorize(credentials) {
          await connectToMongoDB().catch((err) => {
            throw new Error(err);
          });
          const user = await User.findOne({
            email: credentials?.email,
          }).select("+password");

          if (!user) {
            throw new Error("Invalid credentials");
          }

          const isPasswordCorrect = await compare(
            credentials!.password,
            user.password
          );

          if (!isPasswordCorrect) {
            throw new Error("Invalid credentials");
          }
        },
      },
    }),
  ],
};
