import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import yourDatabaseQueryToFetchUserData from "./getuser";
import yourDatabaseQueryToFetchUserDataDetail from "./getuserdetail";


const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        mobileNo: { label: "Mobile Number", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { mobileNo, password } = credentials;
        const userdata = await yourDatabaseQueryToFetchUserData(mobileNo, password);

        if (userdata) {
          return Promise.resolve({ id: 1, name: userdata.displayName, email: userdata.email });
        } else {
          return Promise.resolve(null);
        }
      },
    }),
  ],
  callbacks: {
    async session(session, user) {
      if (session.token.name) {
        const userData = await yourDatabaseQueryToFetchUserDataDetail(session.token.email);
        const email = userData.email || [];
        const role = userData.role || [];
        const pbs_code = userData.pbs_code || [];
        const zonal_code = userData.zonal_code || [];
        const image = userData.image || [];
        const displayName = session?.token?.name || [];

        // Add roles to the session object
        session.email = { ...session.user, email };
        session.role = { ...session.user, role };
        session.pbs_code = { ...session.user, pbs_code };
        session.zonal_code = { ...session.user, zonal_code };
        session.displayName = { ...session.user, displayName };
        session.image = { ...session.user, image };
        // console.log("session from session",userData)
        return session;
      } else {
        return session;
      }
    },

  },
  pages: {
    signIn: "/login",
  },
};

export default NextAuth(authOptions);
