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
import ComplainReport from '@/components/Reports/Complain';

const Categories = ({ electricity, electricity1 ,complain,complain1}) => {
  // console.log(electricity)
  console.log(complain)
  const [api, contextHolder] = notification.useNotification();
  const { data: session } = useSession();

  console.log(session);
  


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

  // console.log(category);
  return (
    <div>
      {contextHolder}
      <Header>
        <InfoEntrySidebar category={category} setFormId={setFormId}>
          {!formId && <FeaturedCategories key={category.category} allProducts={category}></FeaturedCategories>}
          {formId == 1 && <ElectricityAddForm></ElectricityAddForm>}
          {formId == 2 && <ElectricityReport electricity={electricity}></ElectricityReport>}
          {formId == 3 && <ElectricityReport electricity={electricity1}></ElectricityReport>}
          {formId == 4 && <ComplainAddForm ></ComplainAddForm>}
          {formId == 5 && <ComplainReport complain={complain}></ComplainReport>}
          {formId == 6 && <ComplainReport complain={complain1}></ComplainReport>}
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
    const resComplain = await fetch(`http://localhost:5000/complain/${zonalCode}`);
    const dataComplain = await resComplain.json();
    const res1Complain = await fetch(`http://localhost:5000/complainAll/${zonalCode}`);
    const data1Complain = await res1Complain.json();

    return {
      props: {
        electricity: data.data,
        electricity1: data1.data,
        complain: dataComplain.data,
        complain1: data1Complain.data,
      },
      // revalidate: 10,
    };
  } catch (error) {
    console.error('Error fetching electricity data:', error);
    return {
      props: {
        electricity: [],
        electricity1: [],
        complain: [],
        complain1: [],
      },
      // revalidate: 10,
    };
  }
}


