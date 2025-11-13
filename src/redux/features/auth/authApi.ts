import {baseApi} from '@/redux/baseApi';
import {TUser} from '@/types/user.types';
import comparePassword from '@/utils/comparePassword';
import {toast} from 'react-toastify';

const authManagementApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		userRegister: builder.mutation({
			query: (data) => {
				return {
					url: `tarazUser/new`,
					method: 'POST',
					body: data,
				};
			},
			invalidatesTags: ['auth', 'user'],
			transformResponse: (response) => {
				if (response) {
					return response;
				}
			},
		}),
		userLogin: builder.mutation({
			queryFn: async (data, _queryApi, _extraOptions, baseQuery) => {
				try {
					// 1. Fetch all users
					const response = await baseQuery({
						url: `tarazUser/`,
						method: 'GET',
					});

					if (response.error) {
						return {error: response.error};
					}

					const users: TUser[] = response.data as TUser[];

					// 2. Find user by email
					const user = users.find((u) => u.email === data.email);
					if (!user) {
						toast.error('User not found');
						return {error: {status: 404, data: 'User not found'}};
					}

					// 3. Compare password
					const isPasswordValid = await comparePassword(data.password, user.password_hash);
					if (!isPasswordValid) {
						toast.error('Invalid password');
						return {error: {status: 401, data: 'Invalid password'}};
					}

					// 4. Success

					return {data: user}; // ✅ Return inside { data }
				} catch (err: any) {
					console.error(err);
					return {error: {status: 500, data: 'Internal server error'}};
				}
			},
		}),
	}),
});

export const {useUserRegisterMutation, useUserLoginMutation} = authManagementApi;
