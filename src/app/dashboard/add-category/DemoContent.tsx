'use client';

import React, {useState} from 'react';
import Image from 'next/image';
import ZForm from '@/components/form/ZForm';
import ZInput from '@/components/form/ZInput';
import {FieldValues} from 'react-hook-form';
import {catchAsync} from '@/utils/catchAsync';
import {toast} from 'react-toastify';
import {zodResolver} from '@hookform/resolvers/zod';
import {categorySchema} from '@/schemas/product.schema';
import {useCreateCategoryMutation} from '@/redux/features/category/categoryApi';

const AddProductPage = () => {
	const [createCategory, {isLoading}] = useCreateCategoryMutation();
	const handleSubmit = async (data: FieldValues) => {
		catchAsync(async () => {
			const result = await createCategory(data).unwrap();
			if (result) {
			} else {
				// Handle failure (e.g., show an error message)
				toast.error('Failed to create category');
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
									Add New Product Category
								</h6>
							</div>

							<div className="input-main-wrapper">
								<ZForm onSubmit={handleSubmit} resolver={zodResolver(categorySchema)}>
									<div className="row">
										<div className="single-input col-md-6">
											<label htmlFor="productName">Category Name </label>
											<ZInput name="name" label="Category Name" type="text" />
										</div>
										<div className="single-input col-md-6">
											<label htmlFor="productName">Category Value </label>
											<span style={{fontSize: '10px'}} className="text-muted ms-1 fw-bold">
												(value will show add product page)
											</span>
											<ZInput name="value" label="Category Value" type="text" />
										</div>
									</div>

									<div className="button-area-botton-wrapper-p-list">
										<button type="submit" className="rts-btn btn-primary" disabled={isLoading}>
											{isLoading ? 'Saving...' : 'Save Category'}
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
