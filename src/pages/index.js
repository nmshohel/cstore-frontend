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
import ReceivedRevenueItem from '@/components/Dashboard/ReceivedRevenueItem';
import MyRevenueItem from '@/components/Dashboard/MyRevenueItem';

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
    const resRevenueItem = await fetch(`${process.env.BACKEND_URL}/api/v1/revenue-item/${session?.pbs_code?.pbs_code}`, getMethod);
    const dataRevenueItem = await resRevenueItem.json();
    const resCapitalItem = await fetch(`${process.env.BACKEND_URL}/api/v1/capital-item/${session?.pbs_code?.pbs_code}`, getMethod);
    const dataCapitalItem = await resCapitalItem.json();
    const resNotReceivedCapitalItem = await fetch(`${process.env.BACKEND_URL}/api/v1/capital-item/not-receive/${session?.pbs_code?.pbs_code}`, getMethod);
    const dataNotReceivedCapitalItem = await resNotReceivedCapitalItem.json();
    const resMyCapitalItem = await fetch(`${process.env.BACKEND_URL}/api/v1/capital-item/assignTo/${session?.mobileNo?.mobileNo}`, getMethod);
    const dataMyCapitalItem = await resMyCapitalItem.json();
    const resMyRevenueItem = await fetch(`${process.env.BACKEND_URL}/api/v1/revenue-item/reveived-by`, getMethod);
    const dataMyRevenueItem = await resMyRevenueItem.json();
    const resNotReceivedRevenueItem = await fetch(`${process.env.BACKEND_URL}/api/v1/revenue-item/ReveivePending`, getMethod);
    const dataNotReceivedRevenueItem = await resNotReceivedRevenueItem.json();
    let dataNotCertifyCapitalItem = "", dataNotApproveCapitalItem = "";
    if (session?.role?.role == "admin") {
        const resNotCertifyCapitalItem = await fetch(`${process.env.BACKEND_URL}/api/v1/capital-item/not-certify/${session?.pbs_code?.pbs_code}`, getMethod);
        dataNotCertifyCapitalItem = await resNotCertifyCapitalItem.json();
    }
    if (session?.role?.role == "admin") {
        const resNotApproveCapitalItem = await fetch(`${process.env.BACKEND_URL}/api/v1/capital-item/not-approve/${session?.pbs_code?.pbs_code}`, getMethod);
        dataNotApproveCapitalItem = await resNotApproveCapitalItem.json();
    }
    return {
        props: {
            revenueItem: dataRevenueItem.data || [],
            capitalItem: dataCapitalItem.data || [],
            notReceivedRevenueItem: dataNotReceivedRevenueItem.data || [],
            myCapitalItem: dataMyCapitalItem.data || [],
            myRevenueItem: dataMyRevenueItem.data || [],
            notCertifyCapitalItem: dataNotCertifyCapitalItem.data || [],
            notApproveCapitalItem: dataNotApproveCapitalItem.data || [],
            notReceiveCapitalItem: dataNotReceivedCapitalItem.data || [],
        },
    };
}
const Categories = ({ context, revenueItem, capitalItem, notReceivedRevenueItem, myCapitalItem, myRevenueItem, notCertifyCapitalItem, notApproveCapitalItem, notReceiveCapitalItem }) => {
    const [api, contextHolder] = notification.useNotification();
    const { data: session } = useSession();
    const [formId, setFormId] = useState("");

    //console.log(category);
    return (
        <div>
            {contextHolder}
            <Header>
                <DashboardSidebar setFormId={setFormId}>
                    {formId == 1 && <CertifyCapitalItem notCertifyCapitalItem={notCertifyCapitalItem}></CertifyCapitalItem>}
                    {formId == 2 && <ApproveCapitalItem notApproveCapitalItem={notApproveCapitalItem}></ApproveCapitalItem>}
                    {formId == 5 && <ReceivedCapitalItem notReceiveCapitalItem={notReceiveCapitalItem}></ReceivedCapitalItem>}
                    {formId == 6 && <ReceivedRevenueItem notReceivedRevenueItem={notReceivedRevenueItem}></ReceivedRevenueItem>}
                    {(formId == 7 || formId == "") && <MyCapitalItem myCapitalItem={myCapitalItem}></MyCapitalItem>}
                    {(formId == 8 || formId == "") && <MyRevenueItem myRevenueItem={myRevenueItem}></MyRevenueItem>}
                </DashboardSidebar>
            </Header >

        </div>
    );
};

export default Categories;
