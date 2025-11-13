import {baseApi} from '@/redux/baseApi';
import {toast} from 'react-toastify';

export const productManagementApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getSingleProduct: builder.query({
			query: (id) => {
				return {
					url: `zafran1Product/${id}`,
					method: 'GET',
				};
			},
			providesTags: ['product'],
			transformResponse: (response) => response,
		}),
		updateProduct: builder.mutation({
			query: ({id, data}) => {
				return {
					url: `zafran1Product/${id}`,
					method: 'PUT',
					body: data,
				};
			},
			invalidatesTags: ['product'],
			transformResponse: (response) => {
				if (response) {
					return response;
				}
			},
		}),
		createProduct: builder.mutation({
			query: (data) => {
				return {
					url: `zafran1Product/new`,
					method: 'POST',
					body: data,
				};
			},
			invalidatesTags: ['product'],
			transformResponse: (response) => {
				toast.success('Product created successfully');
				return response;
			},
		}),
		getAllProducts: builder.query({
			query: () => {
				return {
					url: `zafran1Product`,
					method: 'GET',
				};
			},
			providesTags: ['product'],
			transformResponse: (response) => response,
		}),
		deleteProduct: builder.mutation({
			query: (id) => {
				return {
					url: `zafran1Product/${id}`,
					method: 'DELETE',
				};
			},
			invalidatesTags: ['product'],
			transformResponse: (response) => {
				toast.success('Product deleted successfully');
				return response;
			},
		}),
	}),
});

export const {
	useGetSingleProductQuery,
	useUpdateProductMutation,
	useCreateProductMutation,
	useGetAllProductsQuery,
	useDeleteProductMutation,
} = productManagementApi;
