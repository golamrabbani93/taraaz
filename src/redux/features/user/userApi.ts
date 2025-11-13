import {baseApi} from '@/redux/baseApi';
import {toast} from 'react-toastify';

const userManagementApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getMyProfile: builder.query({
			query: (id) => {
				return {
					url: `zafran1User/${id}`,
					method: 'GET',
				};
			},
			providesTags: ['user'],
			transformResponse: (response) => response,
		}),
		updateMyProfile: builder.mutation({
			query: ({id, ...data}) => {
				console.log(data);
				return {
					url: `zafran1User/${id}`,
					method: 'PUT',
					body: data,
				};
			},
			invalidatesTags: ['user'],
			transformResponse: (response) => {
				if (response) {
					toast.success('Profile updated successfully');
					return response;
				}
			},
		}),
		updateMyProfilePhoto: builder.mutation({
			query: ({email, data}) => {
				return {
					url: `users/${email}/update/`,
					method: 'PUT',
					body: data,
				};
			},
			invalidatesTags: ['user'],
			transformResponse: (response) => {
				toast.success('Photo updated successfully');
				return response;
			},
		}),
		getAllUsers: builder.query({
			query: () => ({
				url: 'zafran1User/',
				method: 'GET',
			}),
			providesTags: ['user'],
			transformResponse: (response) => response,
		}),
		deleteUser: builder.mutation({
			query: (id) => ({
				url: `zafran1User/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['user'],
			transformResponse: (response) => {
				toast.success('User deleted successfully');
				return response;
			},
		}),
	}),
});

export const {
	useGetMyProfileQuery,
	useUpdateMyProfileMutation,
	useUpdateMyProfilePhotoMutation,
	useGetAllUsersQuery,
	useDeleteUserMutation,
} = userManagementApi;
