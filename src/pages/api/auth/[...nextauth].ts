import { compare } from "bcryptjs";
import { connectToMongoDB } from "lib/mongodb";
import User from "models/user";
import NextAuth, { NextAuthOptions } from "next-auth";
// import { SignInParams } from "next-auth/adapters";
// import jwt from "jsonwebtoken";
import CredentialsProvider from "next-auth/providers/credentials";
import { IUser } from "types";
import jwt from "jsonwebtoken";
import UserRoles from "models/userRoles";
import clientPromise from "lib/setupAdapter";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";


type AuthOptions = NextAuthOptions & {
  pages: {
    signIn: string;
    error: string;
    verifyEmail: string | null;
    selectRole: string; // Add a route to your entity selection page
  };
};

const options: AuthOptions = {
  debug: true,
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: "test",
    collections: {
      Users: "users",
      Accounts: "accounts",
      Sessions: "sessions",
      VerificationTokens: "userVerifications"
    }
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        },
      }
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
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
    error: "/login",
    verifyEmail: "/verify-email", // TODO";
    selectRole: "/select-role",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    // jwt: async ({ token, user }: any) => {
    //   // console.log("USER", user)
    //   // console.log("TOKEN", token)
    //   // await connectToMongoDB().catch((err) => {
    //   //   throw new Error(err);
    //   // });

    //   if (user) {
    //     token.user = user;

    //     try {
    //       const userRoles = await UserRoles.find({ user: user._id }).populate({
    //         path: "role",
    //         populate: { path: "permissions" },
    //       });
    //       token.userRoles = userRoles;

    //       return token;
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }

    //   return token;
    // },
    session: async ({ session, token }: any) => {
      // console.log("SESSION", session)
      // console.log("TOKEN", token)


      // console.log("TOKEN", token)

      // await connectToMongoDB().catch((err) => {
      //   throw new Error(err);
      // });

      // if (user) {
      //   token.user = user;

      // try {
      // const userRoles = await UserRoles.find({ user: token.user._id }).populate(
      //   { path: "role", populate: { path: "permissions" } }
      // );
      // token.userRoles = userRoles;

      //     // return token
      //   } catch(error) {
      //     console.log(error)
      //   }
      // // }

      // if (token && token.user) {
      //   const accessToken = jwt.sign(
      //     { user: token.user, userRoles: userRoles },
      //     process.env.NEXT_PUBLIC_AUTH_SECRET as string,
      //     { expiresIn: "1d" }
      //   );

      //   session.userRoles = userRoles;
      //   session.accessToken = accessToken;
      //   session.user = token.user as IUser;
      //   // console.log("ACCESS TOKEN", accessToken)
      // }
      return session;
    },
    signIn: async (params: any) => {
      const { user, account, profile } = params;

      if (account.provider === "google") {
        // return profile.email_verified && profile.email.endsWith("@example.com")
        return true;
      }

      // // If the user hasn't selected an entity, redirect them to the entity selection page
      // if (!user.entity) {
      //   return Promise.resolve("/entity-selection");
      // }

      // // If the user has an entity selected, proceed with regular authentication
      // return Promise.resolve(true);


      // console.log("ACCOUNT", profile)

      // try {
      //   const userRoles = await UserRoles.find({ user: user._id }).populate({
      //     path: "role",
      //     populate: { path: "permissions" },
      //   });

      //   // console.log("USER ROLES", userRoles);

      //   // Include the roles in the JWT token's payload
      //   // user.token = jwt.sign({ ...user, roles: userRoles }, process.env.NEXT_PUBLIC_AUTH_SECRET as string, {
      //   //   expiresIn: '5m',
      //   // });

      //   // session.userRoles = userRoles;
      //   return "http://localhost:3000/select-role"
      // } catch (error) {
      //   console.log(error);
      // }

      return true;
    },
  },
};

export default NextAuth(options);
