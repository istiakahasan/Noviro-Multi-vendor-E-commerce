// // app/api/auth/[...nextauth]/route.ts
// import NextAuth, { NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

// declare module "next-auth" {
//   interface Session {
//     googleIdToken?: string;
//   }
//   interface JWT {
//     googleIdToken?: string;
//   }
// }

// export const authOptions: NextAuthOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       authorization: {
//         params: {
//           prompt: "consent",
//           access_type: "offline",
//           response_type: "code",
//         },
//       },
//     }),
//   ],

//   callbacks: {
//     async jwt({ token, account }) {
//       if (account?.id_token) {
//         token.googleIdToken = account.id_token;
//       }

// console.log(account, token ,"jjjjjjjjjjjjjjjjjjjjjjjj")

//       return token;
//     },

//     async session({ session, token }) {
//       session.googleIdToken = token.googleIdToken as string;

// console.log(session, "fffffffffffffffffffffffffffffffffffffff")

//       return session;
//     },
//   },

//   pages: {
//     signIn: "/auth/login",
//     error: "/auth/login",
//   },

//   session: {
//     strategy: "jwt",
//   },

//   secret: process.env.NEXTAUTH_SECRET,
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };
















import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { jwtDecode } from "jwt-decode";

// Define the user data from JWT token
interface TokenUserData {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  profilePic?: string;
  role?: string;
}

declare module "next-auth" {
  interface Session {
    googleIdToken?: string;
    accessToken?: string;
    refreshToken?: string;
    userData?: TokenUserData;
  }
  
  interface JWT {
    googleIdToken?: string;
    accessToken?: string;
    refreshToken?: string;
    userData?: TokenUserData;
  }
  
  interface User {
    accessToken?: string;
    refreshToken?: string;
    userData?: TokenUserData;
  }
}

// DON'T export this - remove the 'export' keyword
const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("=== SignIn Callback ===");
      
      const apiUrl = process.env.NEXT_PUBLIC_BASE_URL;
      
      if (!apiUrl) {
        console.error("❌ NEXT_PUBLIC_BASE_URL is not defined");
        return false;
      }
      
      try {
        const response = await fetch(`${apiUrl}/auth/google-login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            image: user.image,
            googleId: profile?.sub,
            idToken: account?.id_token,
          }),
        });

        console.log("Backend response status:", response.status);
        
        const responseData = await response.json();
        console.log("Backend response:", responseData);

        if (response.ok && responseData.success && responseData.data?.accessToken) {
          const accessToken = responseData.data.accessToken;
          user.accessToken = accessToken;
          
          try {
            const decodedToken = jwtDecode<TokenUserData>(accessToken);
            console.log("Decoded token:", decodedToken);
            
            user.userData = {
              id: decodedToken.id,
              firstName: decodedToken.firstName,
              lastName: decodedToken.lastName,
              email: decodedToken.email,
              profilePic: decodedToken.profilePic,
              role: decodedToken.role,
            };
          } catch (error) {
            console.error("Error decoding token:", error);
            user.userData = {
              firstName: user.name?.split(" ")[0] || "",
              lastName: user.name?.split(" ").slice(1).join(" ") || "",
              email: user.email || "",
              profilePic: user.image || "",
              role: "user",
            };
          }
          
          console.log("✅ Google login successful, user data stored:", user.userData);
          return true;
        } else {
          console.error("❌ Backend login failed:", responseData);
          return false;
        }
      } catch (error) {
        console.error("❌ Error in Google signIn callback:", error);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      if (account?.id_token) {
        token.googleIdToken = account.id_token;
      }
      
      if (user) {
        token.accessToken = user.accessToken;
        token.userData = user.userData;
      }

      return token;
    },

    async session({ session, token }) {
      session.googleIdToken = token.googleIdToken as string;
      session.accessToken = token.accessToken as string;
      session.userData = token.userData as TokenUserData;
      
      if (token.userData) {
        const userData = token.userData as TokenUserData;
        session.user = {
          ...session.user,
          name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
          email: userData.email,
          image: userData.profilePic,
        };
      }

      return session;
    },
  },

  pages: {
    signIn: "/",
    error: "/auth/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

// Create the handler
const handler = NextAuth(authOptions);

// Export only the handlers
export { handler as GET, handler as POST };