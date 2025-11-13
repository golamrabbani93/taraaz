'use client';

import {
	useGetSingleProductQuery,
	useUpdateProductMutation,
} from '@/redux/features/product/productApi';
import {useEffect, useRef} from 'react';

const ProductVisitCount = ({id}: {id: string}) => {
	const {data, isLoading} = useGetSingleProductQuery(id);
	const [updateCount] = useUpdateProductMutation();

	// ✅ Ensure update triggers only once
	const hasUpdated = useRef(false);

	useEffect(() => {
		if (!isLoading && data && !hasUpdated.current) {
			hasUpdated.current = true; // ✅ mark as updated

			updateCount({
				id,
				data: {
					name: data.name,
					views: (data.views ?? 0) + 1,
				},
			});
		}
	}, [isLoading, data, id, updateCount]);

	return null;
};

export default ProductVisitCount;
