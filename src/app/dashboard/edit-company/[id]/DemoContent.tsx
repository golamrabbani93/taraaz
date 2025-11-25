'use client';

import React, {useState} from 'react';
import ZForm from '@/components/form/ZForm';
import ZInput from '@/components/form/ZInput';
import {FieldValues} from 'react-hook-form';
import {
	useGetSingleCompanyContactQuery,
	useUpdateCompanyContactMutation,
} from '@/redux/features/companyContact/companyContact';
import {catchAsync} from '@/utils/catchAsync';
import {toast} from 'react-toastify';
import {useParams, useRouter} from 'next/navigation';
import DashboardLoader from '@/components/Loader/DashboardLoader/DashboardLoader';
import ZTextArea from '@/components/form/ZTextArea';

const AddProductPage = () => {
	const {id} = useParams();
	const router = useRouter();
	const {data: companyData, isLoading} = useGetSingleCompanyContactQuery(id);
	const [update, {isLoading: isUpdating}] = useUpdateCompanyContactMutation();
	const handleSubmit = async (data: FieldValues) => {
		catchAsync(async () => {
			const result = await update({id: id, data: data}).unwrap();
			if (result) {
				toast.success('Company contact updated successfully');
				router.push('/dashboard/company-contact');
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
									Update contact information
								</h6>
							</div>

							<div className="input-main-wrapper">
								<ZForm onSubmit={handleSubmit} defaultValues={companyData}>
									<div className="row">
										<div className="single-input col-md-6">
											<label htmlFor="productName">English Office Name</label>
											<ZInput name="company_name" label="Office Name" type="text" />
										</div>
										<div className="single-input col-md-6">
											<label htmlFor="productName">Bangla Office Name</label>
											<ZInput name="b_company_name" label="Office Name" type="text" />
										</div>
										<div className="single-input col-md-6">
											<label htmlFor="productName">English Phone </label>
											<ZInput name="phone" label="Phone" type="text" />
										</div>
										<div className="single-input col-md-6">
											<label htmlFor="productName">Bangla Phone </label>
											<ZInput name="b_phone" label="Phone" type="text" />
										</div>
										<div className="single-input col-md-12">
											<label htmlFor="productName">Email </label>
											<ZInput name="email" label="Email" type="text" />
										</div>
										<div className="single-input col-md-6">
											<label htmlFor="productName">English Address</label>
											<ZInput name="address" label="Enter Address" type="text" />
										</div>
										<div className="single-input col-md-6">
											<label htmlFor="productName">Bangla Address</label>
											<ZInput name="b_address" label="Enter Address" type="text" />
										</div>
									</div>

									<div className="row">
										<div className="single-input col-md-6">
											<label htmlFor="productName">WhatsApp Url</label>
											<ZInput name="whatsapp" label="WhatsApp URL" type="text" />
										</div>
										<div className="single-input col-md-6">
											<label htmlFor="productName">Facebook Url</label>
											<ZInput name="facebook" label="Facebook URL" type="text" />
										</div>
										<div className="single-input col-md-6">
											<label htmlFor="productName">Instagram Url</label>
											<ZInput name="instagram" label="Instagram URL" type="text" />
										</div>
										<div className="single-input col-md-6">
											<label htmlFor="productName">Youtube Url</label>
											<ZInput name="youtube" label="Youtube URL" type="text" />
										</div>
										<div className="single-input col-md-6">
											<label htmlFor="productName">Tiktok Url</label>
											<ZInput name="tiktok" label="Tiktok URL" type="text" />
										</div>
										<div className="single-input col-md-6">
											<label htmlFor="productName">Imo Url</label>
											<ZInput name="imo" label="Imo URL" type="text" />
										</div>
										<div className="single-input col-md-12">
											<label htmlFor="productName">Google Map Url</label>
											<ZTextArea name="map" />
										</div>
									</div>

									<div className="button-area-botton-wrapper-p-list">
										<button type="submit" className="rts-btn btn-primary" disabled={isLoading}>
											{isLoading || isUpdating ? 'Updating...' : 'Update Company Contact'}
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
