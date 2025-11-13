import {baseApi} from '@/redux/baseApi';
import {toast} from 'react-toastify';

const messageManagementApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getAllMessages: builder.query({
			query: () => ({
				url: `zafran1Contact`,
				method: 'GET',
			}),
			providesTags: ['message'],
			transformResponse: (response) => response,
		}),
		deleteMessage: builder.mutation({
			query: (id) => ({
				url: `zafran1Contact/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['message'],
			transformResponse: (response) => {
				toast.success('Message deleted successfully');
				return response;
			},
		}),
		createMessage: builder.mutation({
			query: (data) => ({
				url: `zafran1Contact/new`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['message'],
			transformResponse: (response) => {
				if (response) {
					toast.success('Message sent successfully');
					return response;
				}
			},
		}),
	}),
});

export const {useGetAllMessagesQuery, useDeleteMessageMutation, useCreateMessageMutation} =
	messageManagementApi;
