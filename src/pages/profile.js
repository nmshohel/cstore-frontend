"use client"
import Header from '@/components/Layout/Header';
import React, { useState } from 'react';
import { message, notification } from "antd";
import { getSession, useSession } from 'next-auth/react';

import Sidebar from '@/components/Layout/Sidebar';
import UserProfile from '@/components/Pages/Users/UserProfile';

export async function getServerSideProps(context) {

  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const accessToken = session?.accessToken?.accessToken;
  const getMethod = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: accessToken,
    },
  }
  const resEmployee = await fetch(`${process.env.BACKEND_URL}/api/v1/employee/${session?.mobileNo?.mobileNo}`, getMethod);
  const dataEmployee = await resEmployee.json();

  return {
    props: {
      employee: dataEmployee.data || [],
    },
  };
}
const Profile = ({ employee }) => {
  // console.log(dataRevenueItem, capitalItem, notReceiveCapitalItem)
  // console.log(myCapitalItem)
  const [api, contextHolder] = notification.useNotification();
  const { data: session } = useSession();
  const [formId, setFormId] = useState("");

  return (
    <div>
      {contextHolder}
      <Header>
        <Sidebar setFormId={setFormId}>
          {formId == 1 && <UserProfile employee={employee}></UserProfile>}

        </Sidebar>
      </Header >

    </div>
  );
};

export default Profile;
