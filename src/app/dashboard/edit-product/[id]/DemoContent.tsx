'use client';

import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import ZForm from '@/components/form/ZForm';
import ZInput from '@/components/form/ZInput';
import ZTextArea from '@/components/form/ZTextArea';
import {FieldValues} from 'react-hook-form';
import ImageUploader, {UploadedImage} from './ImageUploader';
import {toast} from 'react-toastify';
import {zodResolver} from '@hookform/resolvers/zod';
import {productSchema} from '@/schemas/product.schema';
import {
	useGetSingleProductQuery,
	useUpdateProductMutation,
} from '@/redux/features/product/productApi';
import {useParams} from 'next/navigation';
import DashboardLoader from '@/components/Loader/DashboardLoader/DashboardLoader';
import {useRouter} from 'next/navigation';
import {useGetAllCategoriesQuery} from '@/redux/features/category/categoryApi';
import ZMultiSelect from '@/components/form/ZMultiSelect';
import DynamicTextRows from '@/components/DynamicTextRows/DynamicTextRows';
import {colorOptions, sizeOptions} from './options';
import {generateBarcode} from '@/utils/generateBarcode';
import ZRadio from '@/components/form/ZRadio'; // Added import

const AddProductPage = () => {
	const {id} = useParams();
	const router = useRouter();
	const {data: getSingleProduct, isLoading: productDataLoading} = useGetSingleProductQuery(id);
	const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
	const [updateProduct, {isLoading}] = useUpdateProductMutation();
	const [defaultValues, setDefaultValues] = useState({});
	const [rows, setRows] = useState([{id: 1, question: '', answer: ''}]);
	const [selectedSizes, setSelectedSizes] = useState<{label: string; value: string}[]>([]);
	const [isSizeable, setIsSizeable] = useState<boolean | null>(null);
	const [isSubcategoryDisabled, setIsSubcategoryDisabled] = useState<boolean>(true);
	const [subcategoriesOption, setSubCategoriesOption] = useState<
		{label: string; value: string}[] | null
	>(null);

	const {data: categories} = useGetAllCategoriesQuery('');
	const options =
		categories?.map((category: {name: string; value: string}) => ({
			label: category.name,
			value: category.value,
		})) || [];

	// Handle category change to load subcategories
	const handleCategoryChange = (value: string) => {
		const selectedCat = categories?.find(
			(cat: {name: string; value: string; sub_categories?: any[]}) => cat.value === value,
		);

		if (selectedCat && selectedCat.sub_categories && selectedCat.sub_categories.length > 0) {
			const subCatOptions = selectedCat.sub_categories.map(
				(subCat: {name: string; value: string}) => ({
					label: subCat.name,
					value: subCat.value,
				}),
			);
			setSubCategoriesOption(subCatOptions);
			setIsSubcategoryDisabled(false);
		} else {
			setSubCategoriesOption([]);
			setIsSubcategoryDisabled(true);
			setSubCategoriesOption(null);
		}
	};

	useEffect(() => {
		if (!getSingleProduct) return;

		// helper function to get stock per size
		const getStock = (size: string) => {
			const item = getSingleProduct.stocks_size.find(
				(i: {size: string; stock: number}) => i.size === size,
			);
			return item?.stock ?? '';
		};

		// Get selected category for subcategory loading
		const selectedCategory = getSingleProduct?.categories.value;

		// Set default values for the form fields
		setDefaultValues({
			original_price: getSingleProduct?.original_price?.split?.('.')?.[0] || '',
			name: getSingleProduct?.name || '',
			discount_price: getSingleProduct?.discount_price?.split?.('.')?.[0] || '',
			categories: getSingleProduct?.categories || [],
			description: getSingleProduct?.description || '',
			b_name: getSingleProduct?.b_name || '',
			b_description: getSingleProduct?.b_description || '',
			meta_description: getSingleProduct?.meta_description || '',
			b_meta_description: getSingleProduct?.b_meta_description || '',
			tags: getSingleProduct?.tags?.join(',') || '',
			size: getSingleProduct?.size || [],
			color: getSingleProduct?.color || [],
			material: getSingleProduct?.material || '',
			fit: getSingleProduct?.fit || '',
			stock_XL: getStock('XL'),
			stock_L: getStock('L'),
			stock_S: getStock('S'),
			stock_M: getStock('M'),
			stock_XXL: getStock('XXL'),
			isPublish: getSingleProduct.isPublish ? 'true' : 'false',
			isSizeable: {
				label: getSingleProduct.isSizeable ? 'Yes' : 'No',
				value: getSingleProduct.isSizeable ? true : false,
			},
			stocks: getSingleProduct?.stocks || '',
			sub_categories: getSingleProduct?.sub_categories || [],
		});

		const imageFields = ['image1', 'image2', 'image3', 'image4', 'image5', 'image6'];
		const images = imageFields
			.map((key) => getSingleProduct[key])
			.filter(Boolean)
			.map((url, index) => ({
				id: Math.random().toString(36).substr(2, 9),
				file: null,
				previewUrl: url,
				name: `image${index + 1}.jpg`,
			}));

		setUploadedImages(images);

		//set faq to rows
		if (getSingleProduct.faqs && getSingleProduct.faqs.length > 0) {
			setRows(getSingleProduct.faqs);
		}

		setSelectedSizes(
			getSingleProduct.stocks_size?.map((item: {size: string}) => ({
				label: item.size,
				value: item.size,
			})) || [],
		);

		setIsSizeable(getSingleProduct?.isSizeable ?? null);

		// Load subcategories based on selected category
		if (selectedCategory) {
			const selectedCat = categories?.find(
				(cat: {name: string; value: string; sub_categories?: any[]}) =>
					cat.value === selectedCategory,
			);

			if (selectedCat && selectedCat.sub_categories && selectedCat.sub_categories.length > 0) {
				const subCatOptions = selectedCat.sub_categories.map(
					(subCat: {name: string; value: string}) => ({
						label: subCat.name,
						value: subCat.value,
					}),
				);
				setSubCategoriesOption(subCatOptions);
				setIsSubcategoryDisabled(false);
			}
		}
	}, [getSingleProduct, categories]);

	// handle form submit
	const handleSubmit = async (data: FieldValues) => {
		if (uploadedImages.length < 1) {
			toast.error('Please upload at least 1 images');
			return;
		}
		if (uploadedImages.length > 4) {
			toast.error('You can upload maximum 4 images');
			return;
		}

		const sizeStocks = selectedSizes.map((size, index) => ({
			size: size.value,
			stock: Number(data[`stock_${size.value}`] || 0),
			barcode:
				getSingleProduct?.stocks_size?.find((item: {size: string}) => item.size === size.value)
					?.barcode || Number(generateBarcode('22')), // keep existing barcode if available
		}));

		data.faqs = JSON.stringify(rows);

		//make slug from name
		const slug = data.name
			.toLowerCase()
			.replace(/ /g, '-')
			.replace(/[^\w-]+/g, '');
		data.slug = slug;

		const tag = data?.tags as string;
		data.tags = tag ? JSON.stringify(tag.split(',')) : null;
		data.categories = data?.categories ? JSON.stringify(data.categories) : null;
		data.size = data?.size ? JSON.stringify(data.size) : null;
		data.pin = getSingleProduct?.pin;
		data.color = data?.color ? JSON.stringify(data.color) : null;
		data.stocks_size = isSizeable ? JSON.stringify(sizeStocks) : JSON.stringify([]);
		data.isSizeable = isSizeable;
		data.stocks = isSizeable ? 0 : data.stocks;
		data.isPublish = data.isPublish === 'true' ? true : false; // Changed for ZRadio
		data.sub_categories = data.sub_categories ? JSON.stringify(data.sub_categories) : null;
		data.discounted_price = data.discounted_price || data.original_price;

		// append images to data
		uploadedImages.forEach((image, index) => {
			if (!image.file) return;
			data[`image${index + 1}`] = image.file;
		});

		const formData = new FormData();
		for (const key in data) {
			formData.append(key, data[key]);
		}

		const result = await updateProduct({id, data: formData});
		if (result.data?.id) {
			toast.success('Product updated successfully');
			router.push('/dashboard/product-list');
		}
	};

	if (productDataLoading) {
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
									Update Product
								</h6>
							</div>

							<div className="input-main-wrapper">
								<ZForm
									onSubmit={handleSubmit}
									resolver={zodResolver(productSchema)}
									defaultValues={defaultValues}
								>
									<div className="row">
										<div className="single-input col-md-6 col-12">
											<label htmlFor="productName">Product Name</label>
											<ZInput name="name" label="Product Name" type="text" />
										</div>
										<div className="single-input col-md-6" style={{height: '60px'}}>
											<label htmlFor="productName">Publish this product?</label>
											<ZRadio
												name="isPublish"
												options={[
													{label: 'Yes, Publish', value: 'true'},
													{label: 'No, Save as Draft', value: 'false'},
												]}
											/>
										</div>
									</div>

									<div className="row">
										<div className="single-input col-md-3">
											<label htmlFor="productName">Price </label>
											<ZInput name="original_price" label="Price" type="text" />
										</div>
										<div className="single-input col-md-3">
											<label htmlFor="productName">Discounted Price </label>
											<ZInput name="discount_price" label="Discounted Price" type="text" />
										</div>

										<div className="single-input col-md-3">
											<label htmlFor="productName">Material</label>
											<ZInput name="material" label="Cotton, Silk, Wool" type="text" />
										</div>
										<div className="single-input col-md-3">
											<label htmlFor="productName">Fit</label>
											<ZInput name="fit" label="Slim, Regular, Loose" type="text" />
										</div>

										<div className="single-input col-md-6">
											<label htmlFor="productName">Product Category </label>
											<ZMultiSelect
												isMulti={false}
												name="categories"
												label="Product Category"
												options={options}
												onChange={(values: any) => {
													handleCategoryChange(values.value);
												}}
											/>
										</div>
										<div className="single-input col-md-6">
											<label htmlFor="productName">Product Sub Category </label>
											<ZMultiSelect
												isMulti={false}
												name="sub_categories"
												label="Product Sub Category"
												options={subcategoriesOption || []}
												isDisabled={isSubcategoryDisabled}
											/>
										</div>
										<div className="row">
											<div
												className={`single-input ${isSizeable === null ? 'col-md-12' : 'col-md-6'}`}
											>
												<label htmlFor="productName">Is This Product Sizeable?</label>
												<ZMultiSelect
													isMulti={false}
													name="isSizeable"
													label="Is This Product Sizeable?"
													options={[
														{label: 'Yes', value: true},
														{label: 'No', value: false},
													]}
													onChange={(values: any) => setIsSizeable(values.value)}
												/>
											</div>

											{isSizeable && (
												<div className="single-input col-md-6">
													<label htmlFor="productName">Size</label>
													<ZMultiSelect
														label="Select Sizes"
														name="size"
														options={sizeOptions}
														onChange={(values: any) => setSelectedSizes(values)}
													/>
												</div>
											)}
											{isSizeable === false && (
												<div className="single-input col-md-6">
													<label htmlFor="productName">Add Total Stocks </label>
													<ZInput name="stocks" label="Stocks" type="text" />
												</div>
											)}
										</div>
										{selectedSizes.length > 0 && (
											<div className="row mt-3">
												<h5>Enter Stocks Per Size</h5>
												<div className="d-flex gap-3 ">
													{selectedSizes.map((size, i) => (
														<div key={i} className="single-input ">
															<label>{size.label} Stock</label>
															<ZInput
																name={`stock_${size.value}`}
																type="number"
																label={`Stock for size ${size.label}`}
															/>
														</div>
													))}
												</div>
											</div>
										)}

										<div className="single-input col-md-12">
											<label htmlFor="productName">Product Color </label>
											<ZMultiSelect name="color" label="Product Color" options={colorOptions} />
										</div>
									</div>

									<div className="row">
										<div className="single-input col-md-6 col-12">
											<label htmlFor="productName">English Short Description</label>
											<ZTextArea name="description" />
										</div>
										<div className="single-input col-md-6 col-12">
											<label htmlFor="productName">English Meta Description</label>
											<ZTextArea name="meta_description" />
										</div>
									</div>

									<h2 className="title">
										{' '}
										Image Uploader
										<p style={{fontSize: '12px', color: '#666'}}>
											{' '}
											At least 1 image and maximum 4 image{' '}
										</p>
									</h2>
									<ImageUploader
										uploadedImages={uploadedImages}
										setUploadedImages={setUploadedImages}
										maxImages={4}
									/>

									<div className="row">
										<div className="single-input ol-12">
											<label htmlFor="productName">Product Tags</label>
											<ZInput label="Product Tags" name="tags" type="text" />
										</div>
										<div className="row">
											<label className="fw-bold" style={{color: '#000'}}>
												{' '}
												Enter FAQ Question And Answer{' '}
											</label>
											<DynamicTextRows rows={rows} setRows={setRows} required={false} />
										</div>
									</div>

									<div className="button-area-botton-wrapper-p-list">
										<button type="submit" className="rts-btn btn-primary" disabled={isLoading}>
											{isLoading ? 'Updating...' : 'Update Product'}
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
