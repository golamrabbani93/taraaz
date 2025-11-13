import {baseApi} from '@/redux/baseApi';
import {toast} from 'react-toastify';

const faqManagementApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		// ✅ Get all FAQs
		getAllFAQs: builder.query({
			query: () => ({
				url: `zafran1FAQ`,
				method: 'GET',
			}),
			providesTags: ['faq'],
			transformResponse: (response) => response,
		}),

		// ✅ Get single FAQ by ID
		getSingleFAQ: builder.query({
			query: (id) => ({
				url: `zafran1FAQ/${id}`,
				method: 'GET',
			}),
			providesTags: ['faq'],
			transformResponse: (response) => response,
		}),

		// ✅ Create new FAQ
		createFAQ: builder.mutation({
			query: (data) => ({
				url: `zafran1FAQ/new`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['faq'],
			transformResponse: (response) => {
				toast.success('FAQ created successfully');
				return response;
			},
		}),

		// ✅ Update FAQ
		updateFAQ: builder.mutation({
			query: ({id, data}) => ({
				url: `zafran1FAQ/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['faq'],
			transformResponse: (response) => {
				toast.success('FAQ updated successfully');
				return response;
			},
		}),

		// ✅ Delete FAQ
		deleteFAQ: builder.mutation({
			query: (id) => ({
				url: `zafran1FAQ/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['faq'],
			transformResponse: (response) => {
				toast.success('FAQ deleted successfully');
				return response;
			},
		}),
	}),
});

export const {
	useGetAllFAQsQuery,
	useGetSingleFAQQuery,
	useCreateFAQMutation,
	useUpdateFAQMutation,
	useDeleteFAQMutation,
} = faqManagementApi;
