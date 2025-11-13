import {baseApi} from '@/redux/baseApi';

const orderManagementApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		createOrder: builder.mutation({
			query: (data) => {
				return {
					url: `tarazOrder/new`,
					method: 'POST',
					body: data,
				};
			},
			invalidatesTags: ['order'],
			transformResponse: (response) => {
				if (response) {
					return response;
				}
			},
		}),
		getAllOrders: builder.query({
			query: () => {
				return {
					url: `tarazOrder`,
					method: 'GET',
				};
			},
			transformResponse: (response) => response,
		}),
		getSingleOrder: builder.query({
			query: (id) => {
				return {
					url: `tarazOrder/${id}`,
					method: 'GET',
				};
			},
			transformResponse: (response) => response,
		}),
		updateOrderStatus: builder.mutation({
			query: ({id, data}) => ({
				url: `tarazOrder/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['order'],
			transformResponse: (response) => response,
		}),
	}),
});

export const {
	useCreateOrderMutation,
	useGetAllOrdersQuery,
	useGetSingleOrderQuery,
	useUpdateOrderStatusMutation,
} = orderManagementApi;
