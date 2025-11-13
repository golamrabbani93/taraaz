import {baseApi} from '@/redux/baseApi';
import {toast} from 'react-toastify';

const zafran3CategoryApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		// ✅ Get all categories
		getAllCategories: builder.query({
			query: () => ({
				url: `tarazCategory/`,
				method: 'GET',
			}),
			providesTags: ['category'],
			transformResponse: (response) => response,
		}),

		// ✅ Get single category by ID
		getSingleCategory: builder.query({
			query: (id) => ({
				url: `tarazCategory/${id}/`,
				method: 'GET',
			}),
			providesTags: ['category'],
			transformResponse: (response) => response,
		}),

		// ✅ Create new category
		createCategory: builder.mutation({
			query: (data) => ({
				url: `tarazCategory/new`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['category'],
			transformResponse: (response) => {
				toast.success('Category created successfully');
				return response;
			},
		}),

		// ✅ Update category
		updateCategory: builder.mutation({
			query: ({id, data}) => ({
				url: `tarazCategory/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['category'],
			transformResponse: (response) => {
				toast.success('Category updated successfully');
				return response;
			},
		}),

		// ✅ Delete category
		deleteCategory: builder.mutation({
			query: (id) => ({
				url: `tarazCategory/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['category'],
			transformResponse: (response) => {
				toast.success('Category deleted successfully');
				return response;
			},
		}),
	}),
});

export const {
	useGetAllCategoriesQuery,
	useGetSingleCategoryQuery,
	useCreateCategoryMutation,
	useUpdateCategoryMutation,
	useDeleteCategoryMutation,
} = zafran3CategoryApi;
