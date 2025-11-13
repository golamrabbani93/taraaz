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
import {useCreateProductMutation} from '@/redux/features/product/productApi';
import {blogSchema} from '@/schemas/blog.schema';
import {useCreateBlogMutation} from '@/redux/features/blog/blogApi';
import {catchAsync} from '@/utils/catchAsync';

const AddProductPage = () => {
	const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
	const [authorImage, setAuthorImage] = useState<UploadedImage[]>([]);
	const [createBlog, {isLoading}] = useCreateBlogMutation();
	const handleSubmit = async (data: FieldValues) => {
		// get images name images like : image1:file1 , image2:file2
		if (uploadedImages.length < 1 || authorImage.length < 1) {
			toast.error('Please upload at least 1 images');
			return;
		}
		const authorImg = authorImage[0];
		const blogImg = uploadedImages[0];
		if (authorImg && authorImg.file) {
			data.author_image = authorImg.file;
		}
		// append images to data
		if (blogImg && blogImg.file) {
			data.image1 = blogImg.file;
		}
		//make slug from name
		const slug = data.title
			.toLowerCase()
			.replace(/ /g, '-')
			.replace(/[^\w-]+/g, '');
		data.slug = slug;
		const modifiedData = {
			title: data.title,
			slug: slug,
			author_name: data.author_name,
			content: data.content,
			author_image: data.author_image,
			cover_image: data.image1,
			meta_title: data.title,
			meta_description: data.title,
			b_title: data.b_title,
			b_content: data.b_content,
		};

		const formData = new FormData();
		for (const key in modifiedData) {
			formData.append(key, modifiedData[key as keyof typeof modifiedData]);
		}

		catchAsync(async () => {
			const result = await createBlog(formData);

			if (result.data?.id) {
				setUploadedImages([]);
				setAuthorImage([]);
				toast.success('Blog created successfully');
			} else {
				toast.error('Failed to create blog. Please try again.');
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
									Add New Blog
								</h6>
							</div>

							<div className="input-main-wrapper">
								<ZForm onSubmit={handleSubmit} resolver={zodResolver(blogSchema)}>
									<div className="row">
										<div className="single-input col-md-4">
											<label htmlFor="productName">English Blog Title</label>
											<ZInput name="title" label="Blog Title" type="text" />
										</div>
										<div className="single-input col-md-4">
											<label htmlFor="productName">Bangla Blog Title</label>
											<ZInput name="b_title" label="Blog Title" type="text" />
										</div>
										<div className="single-input col-md-4">
											<label htmlFor="productName">Author Name</label>
											<ZInput name="author_name" label="Author Name" type="text" />
										</div>
									</div>

									<div className="single-input">
										<label htmlFor="productName">English Blog Content</label>
										<ZTextArea name="content" />
									</div>
									<div className="single-input">
										<label htmlFor="productName">Bangla Blog Content</label>
										<ZTextArea name="b_content" />
									</div>

									<div className="row">
										<div className="col-md-6">
											<h2 className="title">Blog Cover Image</h2>
											<ImageUploader
												uploadedImages={uploadedImages}
												setUploadedImages={setUploadedImages}
												maxImages={1}
											/>
										</div>
										<div className="col-md-6">
											<h2 className="title">Author Image</h2>
											<ImageUploader
												uploadedImages={authorImage}
												setUploadedImages={setAuthorImage}
												maxImages={1}
											/>
										</div>
									</div>

									<div className="button-area-botton-wrapper-p-list mt-3">
										<button type="submit" className="rts-btn btn-primary" disabled={isLoading}>
											{isLoading ? 'Saving...' : 'Save Blog'}
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
