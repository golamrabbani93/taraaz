import {baseApi} from '@/redux/baseApi';
import {toast} from 'react-toastify';

const blogManagementApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		createBlog: builder.mutation({
			query: (data) => ({
				url: `tarazBlog/new`,
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
				url: `tarazBlog`,
				method: 'GET',
			}),
			transformResponse: (response) => response,
			providesTags: ['blog'],
		}),

		getSingleBlog: builder.query({
			query: (id) => ({
				url: `tarazBlog/${id}`,
				method: 'GET',
			}),
			transformResponse: (response) => response,
			providesTags: ['blog'],
		}),

		updateBlog: builder.mutation({
			query: ({id, data}) => ({
				url: `tarazBlog/${id}`,
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
				url: `tarazBlog/${id}`,
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
