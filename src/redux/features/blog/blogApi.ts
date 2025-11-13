import {baseApi} from '@/redux/baseApi';
import {toast} from 'react-toastify';

const blogManagementApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		createBlog: builder.mutation({
			query: (data) => ({
				url: `zafran1Blog/new`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['blog'],
			transformResponse: (response) => {
				if (response) {
					return response;
				}
			},
		}),

		getAllBlogs: builder.query({
			query: () => ({
				url: `zafran1Blog`,
				method: 'GET',
			}),
			transformResponse: (response) => response,
			providesTags: ['blog'],
		}),

		getSingleBlog: builder.query({
			query: (id) => ({
				url: `zafran1Blog/${id}`,
				method: 'GET',
			}),
			transformResponse: (response) => response,
			providesTags: ['blog'],
		}),

		updateBlog: builder.mutation({
			query: ({id, data}) => ({
				url: `zafran1Blog/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['blog'],
			transformResponse: (response) => {
				if (response) {
					toast.success('Blog updated successfully');
					return response;
				}
			},
		}),

		deleteBlog: builder.mutation({
			query: (id) => ({
				url: `zafran1Blog/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['blog'],
			transformResponse: (response) => {
				toast.success('Blog deleted successfully');
				return response;
			},
		}),
	}),
});

export const {
	useCreateBlogMutation,
	useGetAllBlogsQuery,
	useGetSingleBlogQuery,
	useUpdateBlogMutation,
	useDeleteBlogMutation,
} = blogManagementApi;
