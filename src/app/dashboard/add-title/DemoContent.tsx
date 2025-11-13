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
import {useCreateWebsiteTitleMutation} from '@/redux/features/companyTitle/companyTitle';

const AddProductPage = () => {
	const [createCompany, {isLoading}] = useCreateWebsiteTitleMutation();
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
									Add New Home Page Title
								</h6>
							</div>

							<div className="input-main-wrapper">
								<ZForm onSubmit={handleSubmit}>
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
											{isLoading ? 'Saving...' : 'Save Page Title'}
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
