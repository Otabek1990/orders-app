import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { Order } from '../types/order.types';
import { baseUrl } from '../constants/baseUrl';



export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  tagTypes:['Orders'],
  endpoints: (builder) => ({
    getOrders: builder.query<Order[], void>({
      query: () => 'orders',
      providesTags:['Orders']
    }),
    getOrderById: builder.query<Order, number>({
      query: (id) => `orders/${id}`,
      providesTags:['Orders']
    }),
    addOrder: builder.mutation<Order, Omit<Order, 'id'>>({
        query: (newOrder) => ({
          url: 'orders',
          method: 'POST',
          body: newOrder,
        }),
        invalidatesTags:['Orders']
      }),
    updateOrder: builder.mutation<Order, Partial<Order>>({
      query: (order) => ({
        url: `orders/${order.id}`,
        method: 'PUT',
        body: order,
      }),
      invalidatesTags:['Orders']
    }),
    deleteOrder: builder.mutation<void, number>({
      query: (id) => ({
        url: `orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags:['Orders']
    }),
  }),
});

export const { useGetOrdersQuery, useGetOrderByIdQuery,useAddOrderMutation, useUpdateOrderMutation, useDeleteOrderMutation } = orderApi;
