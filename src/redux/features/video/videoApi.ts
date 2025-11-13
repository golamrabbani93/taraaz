import {baseApi} from '@/redux/baseApi';
import {toast} from 'react-toastify';

export const videoManagementApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getAllVideos: builder.query({
			query: () => ({
				url: `zafran1Video`,
				method: 'GET',
			}),
			providesTags: ['video'],
			transformResponse: (response) => response,
		}),
		deleteVideo: builder.mutation({
			query: (id) => ({
				url: `zafran1Video/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['video'],
			transformResponse: (response) => {
				toast.success('Video deleted successfully');
				return response;
			},
		}),
		createVideo: builder.mutation({
			query: (data) => ({
				url: `zafran1Video/new`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['video'],
			transformResponse: (response) => {
				if (response) {
					toast.success('Video created successfully');
					return response;
				}
			},
		}),
		updateVideo: builder.mutation({
			query: ({id, ...data}) => ({
				url: `zafran1Video/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['video'],
			transformResponse: (response) => {
				if (response) {
					toast.success('Video Pin successfully');
					return response;
				}
			},
		}),
	}),
});

export const {
	useGetAllVideosQuery,
	useDeleteVideoMutation,
	useCreateVideoMutation,
	useUpdateVideoMutation,
} = videoManagementApi;
