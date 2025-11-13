'use client';

import React, {useState} from 'react';
import Image from 'next/image';
import ZForm from '@/components/form/ZForm';
import ZInput from '@/components/form/ZInput';
import ZTextArea from '@/components/form/ZTextArea';
import {FieldValues} from 'react-hook-form';
import ImageUploader, {UploadedImage} from './ImageUploader';
import {toast} from 'react-toastify';
import {zodResolver} from '@hookform/resolvers/zod';
import {productSchema} from '@/schemas/product.schema';
import {useCreateBannerMutation} from '@/redux/features/banner/bannerApi';
import {mainBannerSchema} from '@/schemas/banner.schema';
import {useCreateBottomBannerMutation} from '@/redux/features/bottomBanner/bottomBannerApi';

const AddProductPage = () => {
	const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
	const [createBanner, {isLoading}] = useCreateBottomBannerMutation();
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

		//make slug from name
		const slug = data.name
			.toLowerCase()
			.replace(/ /g, '-')
			.replace(/[^\w-]+/g, '');
		data.slug = slug;

		// append images to data
		data.image = uploadedImages[0].file;

		const formData = new FormData();
		for (const key in data) {
			formData.append(key, data[key]);
		}
		const result = await createBanner(formData);
		if (result.data?.id) {
			setUploadedImages([]);
		}
	};

	return (
		<div className="body-root-inner">
			<div className="transection">
				<div className="vendor-list-main-wrapper product-wrapper add-product-page">
					<div className="card-body table-product-select">
						<div className="header-two show right-collups-add-product">
							<div className="right-collups-area-top">
								<h6 className="title" style={{fontSize: '32px'}}>
									Add New Home Page Bottom Banner (1 Banner)
								</h6>
							</div>

							<div className="input-main-wrapper">
								<ZForm onSubmit={handleSubmit} resolver={zodResolver(mainBannerSchema)}>
									<div className="single-input">
										<label htmlFor="productName">Banner Name</label>
										<ZInput name="name" label="Banner Name" type="text" />
									</div>
									<h2 className="title">
										Image Uploader
										<p style={{fontSize: '12px', color: '#666'}}>upload 1 Images</p>
									</h2>
									<ImageUploader
										uploadedImages={uploadedImages}
										setUploadedImages={setUploadedImages}
										maxImages={1}
									/>

									<div className="button-area-botton-wrapper-p-list">
										<button type="submit" className="rts-btn btn-primary" disabled={isLoading}>
											{isLoading ? 'Saving...' : 'Save Banner'}
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
