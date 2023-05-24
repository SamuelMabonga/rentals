import { compare } from 'bcryptjs';
import { connectToMongoDB } from 'lib/mongodb';
import User from 'models/user';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { IUser } from 'types';
import jwt from 'jsonwebtoken';

const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await connectToMongoDB().catch((err) => {
          throw new Error(err);
        });

        const user = await User.findOne({
          email: credentials?.email,
        }).select('+password');

        if (!user) {
          throw new Error('Invalid credentials');
        }

        const isPasswordCorrect = await compare(credentials!.password, user.password);

        if (!isPasswordCorrect) {
          throw new Error('Invalid credentials');
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.user = user;
      }
      return token;
    },
    session: async ({ session, token }:any) => {
      if (token && token.user) {
        const accessToken = jwt.sign(
          { user: token.user },
          'your-secret-key',
          { expiresIn: '1h' }
        );
        session.accessToken = accessToken;
        session.user = token.user as IUser;
      }
      return session;
    },
  },
};

export default NextAuth(options);
