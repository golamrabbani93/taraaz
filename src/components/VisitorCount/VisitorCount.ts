'use client';

import {
	useGetAllCompanyContactsQuery,
	useUpdateCompanyContactMutation,
} from '@/redux/features/companyContact/companyContact';
import {setLanguage} from '@/redux/features/language/languageSlice';
import {useEffect} from 'react';
import useGeoLocation from 'react-ipgeolocation';
import {useDispatch} from 'react-redux';

const VisitorCount = () => {
	const dispatch = useDispatch();
	const {data, isLoading} = useGetAllCompanyContactsQuery(undefined);
	const [updateCount] = useUpdateCompanyContactMutation();
	const location = useGeoLocation();
	const incrementVisitorCount = async () => {
		if (data && data.length > 0) {
			const contact = data[0];
			const updatedContact = {
				...contact,
				country: (Number(contact.country) || 0) + 1,
			};
			await updateCount({id: contact.id, data: updatedContact});
		}
	};
	useEffect(() => {
		if (!isLoading) {
			incrementVisitorCount();
		}
	}, [isLoading]);
	useEffect(() => {
		if (location.country === 'BD') {
			dispatch(setLanguage('bn'));
		} else {
			dispatch(setLanguage('en'));
		}
	}, [location?.country]);

	return null;
};

export default VisitorCount;
