import React from 'react';

const PartsDetails = () => {
  return (
    <h1>This is Activities</h1>
    // <AllProducts allProducts={allProducts}></AllProducts>
  );
};

export default PartsDetails;


// export const getStaticPaths = async (context) => {
//   const { params } = context;
//   ////console.log(params);

//   const res = await fetch(`http://localhost:3000/api/products?category=${params?.category}`);
//   const allProducts = await res.json();
//   ////console.log(allProducts);

//   const paths = allProducts.data.map((part) => ({
//     params: { category: part.id },
//   }));

//   return { paths, fallback: false };
// };

// export const getStaticProps = async (context) => {
//   const { params } = context;
//   ////console.log(params);

//   const res = await fetch(`http://localhost:3000/api/products?category=${params?.category}`);
//   const data = await res.json();
//   ////console.log(data);

//   return {
//     props: {
//       allProducts: data.data,
//     },
//     revalidate: 30,
//   };
// };

// pages/products.js

// This function fetches the data for a specific category on the server side
// export async function getServerSideProps({ params }) {
//   const category = params?.category;
//   // Replace this with the actual logic to fetch data based on the category
//   // For example, you can use your API endpoint here
//   const res = await fetch(`http://localhost:3000/api/products?category=${category}`);
//   const data = await res.json();

//   return {
//     props: {
//       allProducts: data.data,
//     },
//   };
// }

