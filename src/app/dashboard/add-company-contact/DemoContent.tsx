'use client';

import React, {useState} from 'react';
import Image from 'next/image';
import ZForm from '@/components/form/ZForm';
import ZInput from '@/components/form/ZInput';
import {FieldValues} from 'react-hook-form';
import {useCreateProductMutation} from '@/redux/features/product/productApi';
import {useCreateCompanyContactMutation} from '@/redux/features/companyContact/companyContact';
import {catchAsync} from '@/utils/catchAsync';
import {toast} from 'react-toastify';

const AddProductPage = () => {
	const [createCompany, {isLoading}] = useCreateCompanyContactMutation();
	const handleSubmit = async (data: FieldValues) => {
		catchAsync(async () => {
			const result = await createCompany(data).unwrap();
			if (result) {
			} else {
				// Handle failure (e.g., show an error message)
				toast.error('Failed to create company contact');
			}
		});
	};

	return (
		<div className="body-root-inner">
			<div className="transection">
				<div className="vendor-list-main-wrapper product-wrapper add-product-page">
					<div className="card-body table-product-select">
						<div className="header-two show right-collups-add-product">
							<div className="right-collups-area-top">
								<h6 className="title" style={{fontSize: '32px'}}>
									Add New contact information
								</h6>
							</div>

							<div className="input-main-wrapper">
								<ZForm onSubmit={handleSubmit}>
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
											<ZInput name="facebook" label="WhatsApp URL" type="text" />
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
											<label htmlFor="productName">Pinterest Url</label>
											<ZInput name="linkedin" label="Pinterest URL" type="text" />
										</div>
									</div>

									<div className="button-area-botton-wrapper-p-list">
										<button type="submit" className="rts-btn btn-primary" disabled={isLoading}>
											{isLoading ? 'Saving...' : 'Save Contact Info'}
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
