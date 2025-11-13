'use client';

import React, {useState} from 'react';
import ZForm from '@/components/form/ZForm';
import ZInput from '@/components/form/ZInput';
import {FieldValues} from 'react-hook-form';
import {catchAsync} from '@/utils/catchAsync';
import {toast} from 'react-toastify';
import {useParams, useRouter} from 'next/navigation';
import DashboardLoader from '@/components/Loader/DashboardLoader/DashboardLoader';
import {
	useGetSingleWebsiteTitleQuery,
	useUpdateWebsiteTitleMutation,
} from '@/redux/features/companyTitle/companyTitle';

const AddProductPage = () => {
	const {id} = useParams();
	const router = useRouter();
	const {data: companyData, isLoading} = useGetSingleWebsiteTitleQuery(id);
	const [update, {isLoading: isUpdating}] = useUpdateWebsiteTitleMutation();
	const handleSubmit = async (data: FieldValues) => {
		catchAsync(async () => {
			const result = await update({id: id, data: data}).unwrap();
			if (result) {
				router.push('/dashboard/title-list');
			} else {
				// Handle failure (e.g., show an error message)
				toast.error('Failed to create company contact');
			}
		});
	};
	if (isLoading) {
		return <DashboardLoader />;
	}
	return (
		<div className="body-root-inner">
			<div className="transection">
				<div className="vendor-list-main-wrapper product-wrapper add-product-page">
					<div className="card-body table-product-select">
						<div className="header-two show right-collups-add-product">
							<div className="right-collups-area-top">
								<h6 className="title" style={{fontSize: '32px'}}>
									Edit Title
								</h6>
							</div>

							<div className="input-main-wrapper">
								<ZForm onSubmit={handleSubmit} defaultValues={companyData}>
									<div className="row">
										<div className="single-input col-md-12">
											<label htmlFor="productName">Page name</label>
											<ZInput name="page_name" label="Page Name" type="text" />
										</div>
										<div className="single-input col-md-6">
											<label htmlFor="productName">English Title </label>
											<ZInput name="title" label="Title" type="text" />
										</div>
										<div className="single-input col-md-6">
											<label htmlFor="productName">Bangla Title </label>
											<ZInput name="b_title" label="Title" type="text" />
										</div>
									</div>

									<div className="button-area-botton-wrapper-p-list">
										<button type="submit" className="rts-btn btn-primary" disabled={isLoading}>
											{isLoading || isUpdating ? 'Updating...' : 'Update Title'}
										</button>
									</div>
								</ZForm>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddProductPage;
