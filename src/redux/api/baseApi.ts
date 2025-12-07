import { db } from '@/lib/firebase';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  status: 'active' | 'inactive';
  createdAt: string;
}


type PartialProduct = Partial<Product> & { id: string };

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    prepareHeaders: (headers) => headers,
    fetchOptions: { credentials: 'include' }
  }), 
  
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    
    getProducts: builder.query<Product[], void>({
      queryFn: async () => ({ data: [] }),
      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        await cacheDataLoaded;
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          updateCachedData((draft) => {
            return snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as Product[];
          });
        });
        await cacheEntryRemoved;
        unsubscribe();
      },
    }),

    addProduct: builder.mutation<void, Partial<Product>>({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
    }),

 
    updateProduct: builder.mutation<void, PartialProduct>({
      query: ({ id, ...patch }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: patch,
      }),
    }),

    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
    }),

    login: builder.mutation<any, any>({
      query: (credentials) => ({
        url: '/auth/login', 
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});


export const { 
  useGetProductsQuery, 
  useAddProductMutation, 
  useUpdateProductMutation, 
  useDeleteProductMutation,
  useLoginMutation 
} = baseApi;
