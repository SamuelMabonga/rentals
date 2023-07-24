import { compare } from "bcryptjs";
import { connectToMongoDB } from "lib/mongodb";
import User from "models/user";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { IUser } from "types";
import jwt from "jsonwebtoken";
import UserRoles from "models/userRoles";

const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
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

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    jwt: async ({ token, user }: any) => {
      // console.log("USER", user)
      // console.log("TOKEN", token)
      await connectToMongoDB().catch((err) => {
        throw new Error(err);
      });

      if (user) {
        token.user = user;

        try {
          const userRoles = await UserRoles.find({ user: user._id }).populate({
            path: "role",
            populate: { path: "permissions" },
          });
          token.userRoles = userRoles;

          return token;
        } catch (error) {
          console.log(error);
        }
      }

      return token;
    },
    session: async ({ session, token }: any) => {
      // console.log("SESSION", session)
      // console.log("TOKEN", token)

      await connectToMongoDB().catch((err) => {
        throw new Error(err);
      });

      // if (user) {
      //   token.user = user;

      // try {
      const userRoles = await UserRoles.find({ user: token.user._id }).populate(
        { path: "role", populate: { path: "permissions" } }
      );
      // token.userRoles = userRoles;

      //     // return token
      //   } catch(error) {
      //     console.log(error)
      //   }
      // // }

      if (token && token.user) {
        const accessToken = jwt.sign(
          { user: token.user, userRoles: userRoles },
          process.env.NEXT_PUBLIC_AUTH_SECRET as string,
          { expiresIn: "1d" }
        );

        session.userRoles = userRoles;
        session.accessToken = accessToken;
        session.user = token.user as IUser;
        // console.log("ACCESS TOKEN", accessToken)
      }
      return session;
    },
  },
};

export default NextAuth(options);
