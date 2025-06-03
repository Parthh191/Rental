import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

// Add type declarations to extend the NextAuth types
declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name?: string | null;
    token: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      token: string;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name?: string | null;
    accessToken: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Call your backend API for authentication with better error handling
          console.log('Authenticating with credentials:', { email: credentials.email });
          
          // Updated to use port 3001 where the backend is running
          const apiUrl = "http://localhost:3001/api/users/login";
          console.log('Sending request to:', apiUrl);
          
          const res = await fetch(apiUrl, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            // Keep increased timeout
            signal: AbortSignal.timeout(30000), // 30-second timeout
          });
          
          console.log('Response status:', res.status);
          
          if (!res.ok) {
            const errorText = await res.text();
            console.error('Authentication failed:', { status: res.status, response: errorText });
            throw new Error(`Authentication failed: ${res.status} ${errorText || 'No error details'}`);
          }

          const data = await res.json();
          console.log('Authentication successful, received data structure:', Object.keys(data));

          const user = data.data;

          if (!user || !user.token) {
            console.error('Invalid user data received:', user);
            throw new Error('Invalid user data received from server');
          }

          console.log('Authentication completed for user:', user.email);
          
          // Return the user object with the JWT token
          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            token: user.token,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },
  callbacks: {
    async jwt({ token, user }) {
      // Include user data in the token when signing in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        // @ts-ignore - We're adding a custom property
        token.accessToken = user.token; 
      }
      return token;
    },
    async session({ session, token }) {
      // Add the necessary properties from token to session.user
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string | null;
        // @ts-ignore - We're adding a custom property
        session.user.token = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/signup",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };