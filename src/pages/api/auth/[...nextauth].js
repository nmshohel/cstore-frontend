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
          return Promise.resolve({ id: 1, name: userdata.mobileNo, email: userdata.accessToken });
        } else {
          return Promise.resolve(null);
        }
      },
    }),
  ],
  callbacks: {
    async session(session, user) {
      if (session.token.name) {
        const userData = await yourDatabaseQueryToFetchUserDataDetail(session.token.name, session.token.email);
        const mobileNo = userData.mobileNo || [];
        const name = userData.name || [];
        const role = userData.role || [];
        const pbs_code = userData.pbs_code || [];
        const zonal_code = userData.zonal_code || [];
        const photoUrl = userData.photoUrl || [];
        const accessToken = session?.token?.email || [];

        // Add roles to the session object
        session.mobileNo = { ...session.user, mobileNo };
        session.name = { ...session.user, name };
        session.role = { ...session.user, role };
        session.pbs_code = { ...session.user, pbs_code };
        session.zonal_code = { ...session.user, zonal_code };
        session.photoUrl = { ...session.user, photoUrl };
        session.accessToken = { ...session.user, accessToken };
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
