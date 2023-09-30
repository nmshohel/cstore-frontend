

import Header from '@/components/Layout/Header';
import InfoEntrySidebar from '@/components/Layout/InfoEntrySidebar';
import FeaturedCategories from '@/components/UI/FeaturedCategories';
import React, { useState } from 'react';
import { message, notification } from "antd";
import { getSession, useSession } from 'next-auth/react';
import ManageRevinueItem from '@/components/Pages/Info/ManageRevinueItem';
import ManageBrand from '@/components/Pages/Info/ManageBrand';
import ManageModel from '@/components/Pages/Info/ManageModel';
import ManageSupplier from '@/components/Pages/Info/ManageSupplier';
import ManageCapitalItem from '@/components/Pages/Info/ManageCapitalItem';
import AddSupplier from '@/components/Pages/Info/AddSupplier';
import AddBrand from '@/components/Pages/Info/AddBrand';
import AddModel from '@/components/Pages/Info/AddModel';
import AddCapitalItem from '@/components/Pages/Info/AddCapitalItem';
import AddRevenueItem from '@/components/Pages/Info/AddRevenueItem';
import IssueCapitalItem from '@/components/Dashboard/IssueCapitalItem';
import AddServicing from '@/components/Pages/Info/AddServicing';
import IssueRevinueItem from '@/components/Dashboard/IssueRevinueItem';

export async function getServerSideProps(context) {
  const session = await getSession(context);
  // const session = {
  //   mobileNo: { mobileNo: '01866115239' },
  //   pbs_code: { pbs_code: '29' },
  //   zonal_code: { zonal_code: '2902' },
  //   role: { role: 'admin' },
  //   accessToken: { accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtb2JpbGVObyI6IjAxODY2MTE1MjM5Iiwicm9sZSI6ImFkbWluIiwiem9uYWxDb2RlIjoiMjkwMiIsImNvbXBsYWluQ29kZSI6bnVsbCwic3Vic3RhdGlvbkNvZGUiOm51bGwsInBic0NvZGUiOiIyOSIsImlhdCI6MTY5NTcwMTcwMCwiZXhwIjoxNjk1Nzg4MTAwfQ.JkC00W44xfYEhmZzZH71B89xONgOx0OT9DJu9oUFQYg" },
  // }
  if (!session || session.role.role !== "admin") {
    return {
      redirect: {
        destination: "/dashboard",
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
  const resBrand = await fetch(`${process.env.BACKEND_URL}/api/v1/brand`, getMethod);
  const dataBrand = await resBrand.json();
  const resModel = await fetch(`${process.env.BACKEND_URL}/api/v1/model`, getMethod);
  const dataModel = await resModel.json();
  const resSupplier = await fetch(`${process.env.BACKEND_URL}/api/v1/supplier/${session?.pbs_code?.pbs_code}`, getMethod);
  const dataSupplier = await resSupplier.json();
  const resItemType = await fetch(`${process.env.BACKEND_URL}/api/v1/item-type`, getMethod);
  const dataItemType = await resItemType.json();
  const resCategory = await fetch(`${process.env.BACKEND_URL}/api/v1/category`, getMethod);
  const dataCategory = await resCategory.json();
  const resSubCategory = await fetch(`${process.env.BACKEND_URL}/api/v1/sub-category`, getMethod);
  const dataSubCategory = await resSubCategory.json();
  const resNotAssignCapitalItem = await fetch(`${process.env.BACKEND_URL}/api/v1/capital-item/not-assign/${session?.pbs_code?.pbs_code}`, getMethod);
  const dataNotAssignCapitalItem = await resNotAssignCapitalItem.json();
  const resNotAssignRevenueItem = await fetch(`${process.env.BACKEND_URL}/api/v1/capital-item/not-assign/${session?.pbs_code?.pbs_code}`, getMethod);
  const dataNotAssignRevenueItem = await resNotAssignRevenueItem.json();
  const resUsers = await fetch(`${process.env.BACKEND_URL}/api/v1/user/${session?.pbs_code?.pbs_code}`, getMethod);
  const dataUsers = await resUsers.json();
  const resZonal = await fetch(`${process.env.BACKEND_URL}/api/v1/zonal/${session?.pbs_code?.pbs_code}`, getMethod);
  const dataZonal = await resZonal.json();
  // //console.log(data);
  return {
    props: {
      revenueItem: dataRevenueItem.data || [],
      capitalItem: dataCapitalItem.data || [],
      brands: dataBrand.data || [],
      models: dataModel.data || [],
      suppliers: dataSupplier.data || [],
      itemType: dataItemType.data || [],
      categroys: dataCategory.data || [],
      subcategroys: dataSubCategory.data || [],
      notAssignCapitalItem: dataNotAssignCapitalItem.data || [],
      notAssignRevenueItem: dataNotAssignRevenueItem.data || [],
      users: dataUsers.data || [],
      zonals: dataZonal.data || [],
    },
  };
}


const Categories = ({ revenueItem, capitalItem, brands, models, suppliers, itemType, categroys, subcategroys, notAssignCapitalItem,notAssignRevenueItem, users, zonals }) => {
  const [api, contextHolder] = notification.useNotification();
  const { data: session } = useSession();
  // //console.log(session?.zonal_code);

  const [formId, setFormId] = useState();
  const category = [
    {
      "id": "1",
      "category": "Electricity",
      "image_url": "https://www.startech.com.bd/image/cache/catalog/ram/cosair/vengeance-8gb-ddr4-3200mhz/vengeance-8gb-ddr4-3200mhz-01-228x228.webp"
    },
    {
      "id": "2",
      "category": "Complain",
      "image_url": "https://www.startech.com.bd/image/cache/catalog/cpu-cooler/antec/t120/t120-01-228x228.jpg"
    },
    {
      "id": "3",
      "category": "Transformer",
      "image_url": "https://www.startech.com.bd/image/cache/catalog/motherboard/asus/prime-h610m-K-d4/prime-h610m-K-d4-02-228x228.jpg"
    },
    {
      "id": "4",
      "category": "SAIDI & SAIFI",
      "image_url": "https://www.startech.com.bd/image/cache/catalog/ram/cosair/vengeance-8gb-ddr4-3200mhz/vengeance-8gb-ddr4-3200mhz-01-228x228.webp"
    }
  ]

  return (
    <div>
      {contextHolder}
      <Header>
        <InfoEntrySidebar category={category} setFormId={setFormId}>
          {!formId && <FeaturedCategories key={categroys.id} categroys={categroys}></FeaturedCategories>}
          {formId == 1 && <AddRevenueItem brands={brands} models={models} suppliers={suppliers} itemType={itemType} categroys={categroys} subcategroys={subcategroys}></AddRevenueItem>}
          {formId == 2 && <ManageRevinueItem revenueItem={revenueItem} brands={brands} models={models} suppliers={suppliers} itemType={itemType} categroys={categroys} subcategroys={subcategroys}></ManageRevinueItem>}
          {formId == 3 && <AddCapitalItem brands={brands} models={models} suppliers={suppliers} itemType={itemType} categroys={categroys} subcategroys={subcategroys} ></AddCapitalItem>}
          {formId == 4 && <ManageCapitalItem capitalItem={capitalItem} brands={brands} models={models} suppliers={suppliers} itemType={itemType} categroys={categroys} subcategroys={subcategroys} ></ManageCapitalItem>}
          {formId == 5 && <IssueCapitalItem users={users} zonals={zonals} notAssignCapitalItem={notAssignCapitalItem}></IssueCapitalItem>}
          {formId == 6 && <IssueRevinueItem users={users} zonals={zonals} notAssignRevenueItem={notAssignRevenueItem}></IssueRevinueItem>}
          {formId == 7 && <AddBrand></AddBrand>}
          {formId == 8 && <ManageBrand brands={brands}></ManageBrand>}
          {formId == 9 && <AddModel brands={brands}></AddModel>}
          {formId == 10 && <ManageModel models={models}></ManageModel>}
          {formId == 11 && <AddSupplier ></AddSupplier>}
          {formId == 12 && <ManageSupplier suppliers={suppliers}></ManageSupplier>}
          {formId == 13 && <AddServicing revenueItem={revenueItem} suppliers={suppliers} ></AddServicing>}
          {/* {formId == 14 && <ManageSupplier suppliers={suppliers}></ManageSupplier>} */}
        </InfoEntrySidebar>
      </Header>
    </div>
  );
};

export default Categories;

