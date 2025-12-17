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

// Update your category schema to include subcategories
// Add this to your category.schema file or update it there
// categorySchema should now be:
/*
import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  value: z.string().min(1, 'Category value is required'),
  subcategories: z.array(z.object({
    name: z.string().min(1, 'Subcategory name is required'),
    value: z.string().min(1, 'Subcategory value is required')
  })).optional().default([])
});
*/

const AddProductPage = () => {
	const [createCategory, {isLoading}] = useCreateCategoryMutation();

	// Local state to manage subcategories UI
	const [subcategories, setSubcategories] = useState<
		Array<{id: number; name: string; value: string}>
	>([]);

	const handleSubmit = async (data: FieldValues) => {
		catchAsync(async () => {
			// Format the data with subcategories
			const categoryData = {
				...data,
				sub_categories: subcategories.map((sub) => ({
					name: sub.name,
					value: sub.value,
				})),
			};

			const result = await createCategory(categoryData).unwrap();
			if (result) {
				toast.success('Category created successfully!');
				// Reset subcategories after successful submission
				setSubcategories([]);
			} else {
				toast.error('Failed to create category');
			}
		});
	};

	// Add new subcategory
	const addSubcategory = () => {
		setSubcategories((prev) => [...prev, {id: Date.now(), name: '', value: ''}]);
	};

	// Remove subcategory
	const removeSubcategory = (id: number) => {
		setSubcategories((prev) => prev.filter((sub) => sub.id !== id));
	};

	// Update subcategory field
	const updateSubcategory = (id: number, field: 'name' | 'value', value: string) => {
		setSubcategories((prev) => prev.map((sub) => (sub.id === id ? {...sub, [field]: value} : sub)));
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

									{/* Subcategories Section */}
									<div className="row mt-4">
										<div className="col-12">
											<div className="d-flex justify-content-between align-items-center mb-3">
												<h6 className="mb-0">Subcategories</h6>
												<div>
													<button
														type="button"
														className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
														onClick={addSubcategory}
														style={{fontSize: '16px'}}
													>
														<i className="fas fa-plus-circle"></i>
														Add Subcategory
													</button>
												</div>
											</div>

											{subcategories.length === 0 ? (
												<div className="alert alert-info py-2">
													<small>
														No subcategories added yet. Click "Add Subcategory" to add one.
													</small>
												</div>
											) : (
												<div className="subcategories-list">
													{subcategories.map((subcategory, index) => (
														<div key={subcategory.id} className="row mb-3 border-bottom pb-3">
															<div className="single-input col-md-5">
																<label className="form-label">
																	Subcategory Name <span className="text-danger">*</span>
																</label>
																<input
																	type="text"
																	className="form-control"
																	placeholder="Enter subcategory name"
																	value={subcategory.name}
																	onChange={(e) =>
																		updateSubcategory(subcategory.id, 'name', e.target.value)
																	}
																	required
																/>
															</div>
															<div className="single-input col-md-5">
																<label className="form-label">
																	Subcategory Value <span className="text-danger">*</span>
																</label>
																<input
																	type="text"
																	className="form-control"
																	placeholder="Enter subcategory value"
																	value={subcategory.value}
																	onChange={(e) =>
																		updateSubcategory(subcategory.id, 'value', e.target.value)
																	}
																	required
																/>
															</div>
															<div className="single-input col-md-2 d-flex align-items-end">
																<button
																	type="button"
																	className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-1"
																	onClick={() => removeSubcategory(subcategory.id)}
																	style={{fontSize: '16px'}}
																>
																	<i className="fas fa-trash-alt"></i>
																	Remove
																</button>
															</div>
														</div>
													))}
												</div>
											)}
										</div>
									</div>

									<div className="button-area-botton-wrapper-p-list mt-4">
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
