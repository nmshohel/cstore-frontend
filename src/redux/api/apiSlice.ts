import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pbsactivities.onrender.com' }),
  tagTypes: ['comments'],
  endpoints: () => ({}),
});
