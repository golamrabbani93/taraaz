'use client';

import {
	useGetAllCompanyContactsQuery,
	useUpdateCompanyContactMutation,
} from '@/redux/features/companyContact/companyContact';
import {
	useGetSingleHitCounterQuery,
	useUpdateHitCounterMutation,
} from '@/redux/features/hitCounter/hitcounter';
import {setLanguage} from '@/redux/features/language/languageSlice';
import {useEffect} from 'react';
import useGeoLocation from 'react-ipgeolocation';
import {useDispatch} from 'react-redux';

const VisitorCount = () => {
	const dispatch = useDispatch();
	const {data: hit, isLoading: hitLoading} = useGetSingleHitCounterQuery(1);
	const [updateCount] = useUpdateHitCounterMutation();
	const location = useGeoLocation();
	const incrementVisitorCount = async () => {
		if (hit) {
			const updatedContact = {
				total_visitor: (hit.total_visitor || 0) + 1,
			};
			await updateCount({id: hit.id, data: updatedContact});
		}
	};
	useEffect(() => {
		if (!hitLoading) {
			incrementVisitorCount();
		}
	}, [hitLoading]);
	useEffect(() => {
		if (location.country === 'BD') {
			dispatch(setLanguage('en'));
		} else {
			dispatch(setLanguage('en'));
		}
	}, [location?.country]);

	return null;
};

export default VisitorCount;
