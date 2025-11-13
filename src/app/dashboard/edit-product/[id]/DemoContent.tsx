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
	useCreateProductMutation,
	useGetSingleProductQuery,
	useUpdateProductMutation,
} from '@/redux/features/product/productApi';
import {useParams} from 'next/navigation';
import DashboardLoader from '@/components/Loader/DashboardLoader/DashboardLoader';
import {useRouter} from 'next/navigation';
import {useGetAllCategoriesQuery} from '@/redux/features/category/categoryApi';
import ZMultiSelect from '@/components/form/ZMultiSelect';
import DynamicTextRows from '@/components/DynamicTextRows/DynamicTextRows';
const AddProductPage = () => {
	const {id} = useParams();
	const router = useRouter();
	const {data: getSingleProduct, isLoading: productDataLoading} = useGetSingleProductQuery(id);
	const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
	const [updateProduct, {isLoading}] = useUpdateProductMutation();
	const [defaultValues, setDefaultValues] = useState({});
	const [rows, setRows] = useState([
		{id: 1, question: '', b_question: '', answer: '', b_answer: ''},
	]);
	//set images link to uploaded images and update images
	const {data: categories} = useGetAllCategoriesQuery('');
	const options =
		categories?.map((category: {name: string; value: string}) => ({
			label: category.name,
			value: category.value,
		})) || [];
	useEffect(() => {
		if (!getSingleProduct) return;
		// Set default values for the form fields
		setDefaultValues({
			original_price: getSingleProduct?.original_price.split('.')[0] || '',
			name: getSingleProduct?.name || '',
			weight: getSingleProduct?.weight || '',
			type: getSingleProduct?.categories || [],
			description: getSingleProduct?.description || '',
			b_name: getSingleProduct?.b_name || '',
			b_description: getSingleProduct?.b_description || '',
			meta_description: getSingleProduct?.meta_description || '',
			b_meta_description: getSingleProduct?.b_meta_description || '',
			tags: getSingleProduct?.tags?.join(',') || '',
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
	}, [getSingleProduct]);

	const handleSubmit = async (data: FieldValues) => {
		// get images name images like : image1:file1 , image2:file2
		if (uploadedImages.length < 1) {
			toast.error('Please upload at least 1 images');
			return;
		}
		if (uploadedImages.length > 4) {
			toast.error('You can upload maximum 4 images');
			return;
		}
		data.faqs = JSON.stringify(rows);
		//make slug from name
		const slug = data.name
			.toLowerCase()
			.replace(/ /g, '-')
			.replace(/[^\w-]+/g, '');
		data.slug = slug;
		const tag = data.tags as string;
		data.tags = JSON.stringify(tag.split(','));
		data.categories = JSON.stringify(data.type);
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
											<label htmlFor="productName">Product English Name</label>
											<ZInput name="name" label="Product English Name" type="text" />
										</div>
										<div className="single-input col-md-6 col-12">
											<label htmlFor="productName">Product Bangla Name</label>
											<ZInput name="b_name" label="Product Bangla Name" type="text" />
										</div>
									</div>
									<div className="row">
										<div className="single-input col-md-6">
											<label htmlFor="productName">Price </label>
											<ZInput name="original_price" label="Price" type="text" />
										</div>
										<div className="single-input col-md-6">
											<label htmlFor="productName">Product weight </label>
											<ZInput name="weight" label="Product weight" type="text" />
										</div>
										<div className="single-input col-md-12">
											<label htmlFor="productName">Product Category </label>
											<ZMultiSelect name="type" label="Product Category" options={options} />
										</div>
									</div>

									<div className="row">
										<div className="single-input col-md-6 col-12">
											<label htmlFor="productName">English Short Description</label>
											<ZTextArea name="description" />
										</div>
										<div className="single-input col-md-6 col-12">
											<label htmlFor="productName">Bangla Short Description</label>
											<ZTextArea name="b_description" />
										</div>
									</div>
									<h2 className="title">
										Image Uploader
										<p style={{fontSize: '12px', color: '#666'}}>
											At least 1 image and maximum 4 image
										</p>
									</h2>
									<ImageUploader
										uploadedImages={uploadedImages}
										setUploadedImages={setUploadedImages}
										maxImages={4}
									/>
									<div className="row">
										<div className="single-input col-md-6 col-12">
											<label htmlFor="productName">English Meta Description</label>
											<ZTextArea name="meta_description" />
										</div>
										<div className="single-input col-md-6 col-12">
											<label htmlFor="productName">Bangla Meta Description</label>
											<ZTextArea name="b_meta_description" />
										</div>
										<div className="single-input ol-12">
											<label htmlFor="productName">Product Tags</label>
											<ZInput label="Product Tags" name="tags" type="text" />
										</div>
										<div className="row">
											<label className="fw-bold" style={{color: '#000'}}>
												Enter FAQ Question And Answer
											</label>
											<DynamicTextRows rows={rows} setRows={setRows} />
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
