import Header from '@/components/Layout/Header';
import InfoEntrySidebar from '@/components/Layout/InfoEntrySidebar';
import ComplainAddForm from '@/components/Pages/ComplainAddForm';
import ElectricityAddForm from '@/components/Pages/ElectricityAddForm';
import TransformerAddForm from '@/components/Pages/TransformerAddForm';
import FeaturedCategories from '@/components/UI/FeaturedCategories';
import React, { useState } from 'react';
import { message, notification } from "antd";
import { getSession, useSession } from 'next-auth/react';
import ElectricityReport from '@/components/Reports/Electricity';

const Categories = ({ electricity, electricity1 }) => {
  console.log(electricity)
  const [api, contextHolder] = notification.useNotification();
  const { data: session } = useSession();

  console.log(session?.zonal_code);
  const onFinish = (values) => {
    console.log('Form values:', values);
    const zonal_code = session?.zonal_code?.zonal_code;
    const withvalues = { ...values, zonal_code };
    fetch("https://pbsactivities.onrender.com/api/electricityAdd", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(withvalues),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.insertedId) {
          const openNotificationWithIcon = (type) => {
            api[type]({
              message: data?.message,
              description: "Inserted ID: " + data?.data?.insertedId,
            });
          };
          openNotificationWithIcon('success')
        } else {
          const openNotificationWithIcon = (type) => {
            api[type]({
              message: data.message,
              description: "Inserted ID: ",
            });
          };
          openNotificationWithIcon('info')
        }
      });
  };


  const [formId, setFormId] = useState("");
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

  console.log(category);
  return (
    <div>
      {contextHolder}
      <Header>
        <InfoEntrySidebar category={category} setFormId={setFormId}>
          {!formId && <FeaturedCategories key={category.category} allProducts={category}></FeaturedCategories>}
          {formId == 1 && <ElectricityAddForm onFinish={onFinish}></ElectricityAddForm>}
          {formId == 2 && <ElectricityReport electricity={electricity}></ElectricityReport>}
          {formId == 3 && <ElectricityReport electricity={electricity1}></ElectricityReport>}
          {formId == 4 && <ComplainAddForm ></ComplainAddForm>}
          {formId == 5 && <TransformerAddForm ></TransformerAddForm>}
        </InfoEntrySidebar>
      </Header >

    </div>
  );
};

export default Categories;

export async function getServerSideProps(context) {
  console.log(context);
  const session = await getSession(context);

  try {
    const zonalCode = session?.zonal_code?.zonal_code || ''; // Handle null or undefined session
    const res = await fetch(`https://pbsactivities.onrender.com/electricity/${zonalCode}`);
    const data = await res.json();
    const res1 = await fetch(`https://pbsactivities.onrender.com/electricityAll/${zonalCode}`);
    const data1 = await res1.json();

    return {
      props: {
        electricity: data.data,
        electricity1: data1.data,
      },
      // revalidate: 10,
    };
  } catch (error) {
    console.error('Error fetching electricity data:', error);
    return {
      props: {
        electricity: [],
        electricity1: [],
      },
      // revalidate: 10,
    };
  }
}


