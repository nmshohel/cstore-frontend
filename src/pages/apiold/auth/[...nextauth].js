import NextAuth from "next-auth"
// import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import yourDatabaseQueryToFetchUserData from "./getuser";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    // ...add more providers here
  ],
  callbacks: {
    async session(session, user) {
      if(session.token.email){
        // console.log("User object in session callback:", session);
      // Fetch additional user data including roles from your backend or database
      const userData = await yourDatabaseQueryToFetchUserData(session.token.email);
        const role = userData.role || [];
        const zonal_code = userData.zonal_code || [];
        const pbs_code = userData.pbs_code || [];

      // Add roles to the session object
        session.role = { ...session.user, role };
        session.zonal_code = { ...session.user, zonal_code };
        session.pbs_code = { ...session.user, pbs_code };
      return session;
      } else {
        return session;
      }
       
    },
  },
  pages:{
    signIn:"/login"
  }
}

export default NextAuth(authOptions)