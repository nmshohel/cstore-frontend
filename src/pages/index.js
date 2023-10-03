"use client"
import Header from '@/components/Layout/Header';
import DashboardSidebar from '@/components/Layout/DashboardSidebar';
// import ComplainAddForm from '@/components/Pages/ComplainAddForm';
// import ElectricityAddForm from '@/components/Pages/ElectricityAddForm';
// import TransformerAddForm from '@/components/Pages/TransformerAddForm';
// import FeaturedCategories from '@/components/UI/FeaturedCategories';
import React, { useState } from 'react';
import { message, notification } from "antd";
import { getSession, useSession } from 'next-auth/react';
import CertifyCapitalItem from '@/components/Dashboard/CertifyCapitalItem';
import ApproveCapitalItem from '@/components/Dashboard/ApproveCapitalItem';
// import IssueCapitalItem from '@/components/Dashboard/IssueCapitalItem';
import ReceivedCapitalItem from '@/components/Dashboard/ReceivedCapitalItem';
import MyCapitalItem from '@/components/Dashboard/MyCapitalItem';

export async function getServerSideProps(context) {
    
    const session = await getSession(context);
    // console.log("session dashboard: ",session);
    // const session = {
    //     mobileNo: { mobileNo: '01866115239' },
    //     pbs_code: { pbs_code: '29' },
    //     zonal_code: { zonal_code: '2902' },
    //     role: { role: 'admin' },
    //     accessToken: { accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGVObyI6IjAxODY2MTE1MjM5Iiwicm9sZSI6ImFkbWluIiwiem9uYWxDb2RlIjoiMjkwMiIsImNvbXBsYWluQ29kZSI6bnVsbCwic3Vic3RhdGlvbkNvZGUiOm51bGwsInBic0NvZGUiOiIyOSIsImlhdCI6MTY5NTU2Mjk2NSwiZXhwIjoxNjk1NjQ5MzY1fQ.Ekk2bkaTPm33H0D0seGOJR4OBMbDQAvM9_9qrtgFBPM" },
    // }
    if (!session || session?.role?.role !== "admin") {
        return {
            redirect: {
                destination: "/",
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
    const resRevenueItem = await fetch(`${process.env.BACKEND_URL}/api/v1/revenue-item/${session?.pbs_code?.pbs_code}`, getMethod);
    const dataRevenueItem = await resRevenueItem.json();
    const resCapitalItem = await fetch(`${process.env.BACKEND_URL}/api/v1/capital-item/${session?.pbs_code?.pbs_code}`, getMethod);
    const dataCapitalItem = await resCapitalItem.json();
    const resNotReceivedCapitalItem = await fetch(`${process.env.BACKEND_URL}/api/v1/capital-item/not-receive/${session?.pbs_code?.pbs_code}`, getMethod);
    const dataNotReceivedCapitalItem = await resNotReceivedCapitalItem.json();
    const resMyCapitalItem = await fetch(`${process.env.BACKEND_URL}/api/v1/capital-item/assignTo/${session?.mobileNo?.mobileNo}`, getMethod);
    const dataMyCapitalItem = await resMyCapitalItem.json();

    let dataNotCertifyCapitalItem = "", dataNotApproveCapitalItem = "";
    if (session?.role?.role == "admin") {
        const resNotCertifyCapitalItem = await fetch(`${process.env.BACKEND_URL}/api/v1/capital-item/not-certify/${session?.pbs_code?.pbs_code}`, getMethod);
        dataNotCertifyCapitalItem = await resNotCertifyCapitalItem.json();
    }
    if (session?.role?.role == "admin") {
        const resNotApproveCapitalItem = await fetch(`${process.env.BACKEND_URL}/api/v1/capital-item/not-approve/${session?.pbs_code?.pbs_code}`, getMethod);
        dataNotApproveCapitalItem = await resNotApproveCapitalItem.json();
    }
    // //console.log(data);
    return {
        props: {
            // revenueItem:  [],
            // capitalItem:  [],
            // notCertifyCapitalItem:[],
            // notApproveCapitalItem: [],
            // notReceiveCapitalItem: [],
            revenueItem: dataRevenueItem.data || [],
            capitalItem: dataCapitalItem.data || [],
            myCapitalItem: dataMyCapitalItem.data || [],
            notCertifyCapitalItem: dataNotCertifyCapitalItem.data || [],
            notApproveCapitalItem: dataNotApproveCapitalItem.data || [],
            notReceiveCapitalItem: dataNotReceivedCapitalItem.data || [],
        },
    };
}
const Categories = ({ context,revenueItem, capitalItem,myCapitalItem, notCertifyCapitalItem, notApproveCapitalItem, notReceiveCapitalItem }) => {
    // console.log(dataRevenueItem, capitalItem, notReceiveCapitalItem)
    // console.log(myCapitalItem)
    const [api, contextHolder] = notification.useNotification();
    const { data: session } = useSession();
    const [formId, setFormId] = useState("");

    //console.log(category);
    return (
        <div>
            {contextHolder}
            <Header>
                {/* <h1>hi</h1> */}
                <DashboardSidebar setFormId={setFormId}>
                    {/* <div></div> */}
                    {formId == 1 && <CertifyCapitalItem notCertifyCapitalItem={notCertifyCapitalItem}></CertifyCapitalItem>}
                    {formId == 2 && <ApproveCapitalItem notApproveCapitalItem={notApproveCapitalItem}></ApproveCapitalItem>}
                    {formId == 5 && <ReceivedCapitalItem notReceiveCapitalItem={notReceiveCapitalItem}></ReceivedCapitalItem>}
                    {(formId == 6 || formId == "") && <MyCapitalItem myCapitalItem={myCapitalItem}></MyCapitalItem>}
                </DashboardSidebar>
            </Header >

        </div>
    );
};

export default Categories;
