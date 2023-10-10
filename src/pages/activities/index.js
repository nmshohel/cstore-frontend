import Header from "@/components/Layout/Header";
import { getSession } from "next-auth/react";
import AdminSidebar from "@/components/Layout/AdminSidebar";

export async function getServerSideProps(context) {
  const session = await getSession(context);
  //console.log(session);
  if (!session || session.role.role !== "admin" || session.role.role !== "zonalAdmin") {
    // Redirect to a page with an appropriate message or display an error message
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const res = await fetch(`https://pbsactivities.onrender.com/zonals/${session?.pbs_code?.pbs_code}`);
  const data = await res.json();
  ////console.log(data);
  return {
    props: {
      zonals: data,
    },
  };
}
const Activities = ({ zonals }) => {


  ////console.log(category);
  return (
    <div>
      <h1>This is admin:  {zonals?.map(z => <p key={z.zonal_code}>{z.zonal_name}</p>)}</h1>
      {/* <FeaturedCategories allProducts={category}></FeaturedCategories> */}
    </div>
  );
};
export default Activities;

Activities.getLayout = function getLayout(page) {
  return (
    <Header>
      <AdminSidebar>
        {page}
      </AdminSidebar>
    </Header >
  )
}