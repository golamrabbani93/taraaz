import {baseApi} from '@/redux/baseApi';
import {toast} from 'react-toastify';

export const websiteTitleManagementApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		// ✅ Get all website titles
		getAllWebsiteTitles: builder.query({
			query: () => ({
				url: `tarazWebsiteTitle`,
				method: 'GET',
			}),
			providesTags: ['websiteTitle'],
			transformResponse: (response) => response,
		}),

		// ✅ Get single website title by ID
		getSingleWebsiteTitle: builder.query({
			query: (id) => ({
				url: `tarazWebsiteTitle/${id}`,
				method: 'GET',
			}),
			providesTags: ['websiteTitle'],
			transformResponse: (response) => response,
		}),

		// ✅ Create new website title
		createWebsiteTitle: builder.mutation({
			query: (data) => ({
				url: `tarazWebsiteTitle/new`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['websiteTitle'],
			transformResponse: (response) => {
				toast.success('Website title created successfully');
				return response;
			},
		}),

		// ✅ Update website title
		updateWebsiteTitle: builder.mutation({
			query: ({id, data}) => ({
				url: `tarazWebsiteTitle/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['websiteTitle'],
			transformResponse: (response) => {
				toast.success('Website title updated successfully');
				return response;
			},
		}),

		// ✅ Delete website title
		deleteWebsiteTitle: builder.mutation({
			query: (id) => ({
				url: `tarazWebsiteTitle/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['websiteTitle'],
			transformResponse: (response) => {
				toast.success('Website title deleted successfully');
				return response;
			},
		}),
	}),
});

export const {
	useGetAllWebsiteTitlesQuery,
	useGetSingleWebsiteTitleQuery,
	useCreateWebsiteTitleMutation,
	useUpdateWebsiteTitleMutation,
	useDeleteWebsiteTitleMutation,
} = websiteTitleManagementApi;
