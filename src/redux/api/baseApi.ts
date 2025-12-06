
import { db } from '@/lib/firebase';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';



// product type definition
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000' }), // Backend URL
  tagTypes: ['Products'],
  endpoints: (builder) => ({
    
   
    getProducts: builder.query<Product[], void>({
      queryFn: async () => {
     
        return { data: [] };
      },
      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
    
        await cacheDataLoaded;

        // Firestore Listener opening
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
          updateCachedData((draft) => {
            // updating redux store by using real time data
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

    // 2. Add Product (Call Backend)
    addProduct: builder.mutation<void, Partial<Product>>({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
        withCredentials: true, //for send cookie
      }),
    }),

    // 3. Delete Product (Call Backend)
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
        withCredentials: true,
      }),
    }),

   // 4. Login (Call Backend)
login: builder.mutation<any, any>({
  query: (credentials) => ({
    url: '/auth/login', 
    method: 'POST',
    body: credentials,
    withCredentials: true,
  }),
}),


  }),
});

export const { 
  useGetProductsQuery, 
  useAddProductMutation, 
  useDeleteProductMutation,
  useLoginMutation 
} = baseApi;
