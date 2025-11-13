import {baseApi} from '@/redux/baseApi';
import {toast} from 'react-toastify';

const companyContactManagementApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		// ✅ Get all company contacts
		getAllCompanyContacts: builder.query({
			query: () => ({
				url: `zafran1CompanyContact`,
				method: 'GET',
			}),
			providesTags: ['companyContact'],
			transformResponse: (response) => response,
		}),

		// ✅ Get single company contact by ID
		getSingleCompanyContact: builder.query({
			query: (id) => ({
				url: `zafran1CompanyContact/${id}`,
				method: 'GET',
			}),
			providesTags: ['companyContact'],
			transformResponse: (response) => response,
		}),

		// ✅ Create new company contact
		createCompanyContact: builder.mutation({
			query: (data) => ({
				url: `zafran1CompanyContact/new`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['companyContact'],
			transformResponse: (response) => {
				toast.success('Company contact created successfully');
				return response;
			},
		}),

		// ✅ Update company contact
		updateCompanyContact: builder.mutation({
			query: ({id, data}) => ({
				url: `zafran1CompanyContact/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['companyContact'],
			transformResponse: (response) => {
				return response;
			},
		}),

		// ✅ Delete company contact
		deleteCompanyContact: builder.mutation({
			query: (id) => ({
				url: `zafran1CompanyContact/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['companyContact'],
			transformResponse: (response) => {
				toast.success('Company contact deleted successfully');
				return response;
			},
		}),
	}),
});

export const {
	useGetAllCompanyContactsQuery,
	useGetSingleCompanyContactQuery,
	useCreateCompanyContactMutation,
	useUpdateCompanyContactMutation,
	useDeleteCompanyContactMutation,
} = companyContactManagementApi;
