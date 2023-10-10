import { getSession } from "next-auth/react";

export async function getServerSideProps(context) {
  const session = await getSession(context);
  //console.log(session);
  if (!session || session.role.role !== "admin") {
    // Redirect to a page with an appropriate message or display an error message
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // Continue with rendering the protected page
  return {
    props: {
      role: session.role.role
    },
  };
}

const users = ({ role }) => {
  //console.log(role);
  return (
    <div>

    </div>
  );
};

export default users;