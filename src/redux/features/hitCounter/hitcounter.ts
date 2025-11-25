import {baseApi} from '@/redux/baseApi';
import {toast} from 'react-toastify';

export const hitCounterApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		// ✅ Get all hit counters
		getAllHitCounters: builder.query({
			query: () => ({
				url: `tarazHitcounter`,
				method: 'GET',
			}),
			providesTags: ['hitCounter'],
			transformResponse: (response) => response,
		}),

		// ✅ Get single hit counter by ID
		getSingleHitCounter: builder.query({
			query: (id) => ({
				url: `tarazHitcounter/${id}`,
				method: 'GET',
			}),
			providesTags: ['hitCounter'],
			transformResponse: (response) => response,
		}),

		// ✅ Create hit counter
		createHitCounter: builder.mutation({
			query: (data) => ({
				url: `tarazHitcounter/new`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['hitCounter'],
			transformResponse: (response) => {
				toast.success('Hit counter created successfully');
				return response;
			},
		}),

		// ✅ Update hit counter
		updateHitCounter: builder.mutation({
			query: ({id, data}) => ({
				url: `tarazHitcounter/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['hitCounter'],
			transformResponse: (response) => {
				return response;
			},
		}),

		// ✅ Delete hit counter
		deleteHitCounter: builder.mutation({
			query: (id) => ({
				url: `tarazHitcounter/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['hitCounter'],
			transformResponse: (response) => {
				toast.success('Hit counter deleted successfully');
				return response;
			},
		}),
	}),
});

export const {
	useGetAllHitCountersQuery,
	useGetSingleHitCounterQuery,
	useCreateHitCounterMutation,
	useUpdateHitCounterMutation,
	useDeleteHitCounterMutation,
} = hitCounterApi;
