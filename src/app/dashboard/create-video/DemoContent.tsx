'use client';

import React, {useState} from 'react';
import ZForm from '@/components/form/ZForm';
import ZInput from '@/components/form/ZInput';
import {FieldValues} from 'react-hook-form';
import {toast} from 'react-toastify';
import {zodResolver} from '@hookform/resolvers/zod';
import {videoSchema} from '@/schemas/video.schema';
import {useCreateVideoMutation} from '@/redux/features/video/videoApi';

const AddProductPage = () => {
	const [createVideo, {isLoading}] = useCreateVideoMutation();
	const handleSubmit = async (data: FieldValues) => {
		//my url https://www.youtube.com/watch?v=v9bOWjwdTlg&t=15346s

		const modifyData = {
			title: data.title,
			video_id: data.url.split('v=')[1].split('&')[0],
			slug: data.title
				.toLowerCase()
				.replace(/ /g, '-')
				.replace(/[^\w-]+/g, ''),
			thumbnail: `https://img.youtube.com/vi/${
				data.url.split('v=')[1].split('&')[0]
			}/hqdefault.jpg`,
		};

		try {
			const result = await createVideo(modifyData).unwrap();
		} catch (error) {
			toast.error('Failed to create video');
		}
		// get images name images like : image1:file1 , image2:file2
	};

	return (
		<div className="body-root-inner">
			<div className="transection">
				<div className="vendor-list-main-wrapper product-wrapper add-product-page">
					<div className="card-body table-product-select">
						<div className="header-two show right-collups-add-product">
							<div className="right-collups-area-top">
								<h6 className="title" style={{fontSize: '32px'}}>
									Add New Video
								</h6>
							</div>

							<div className="input-main-wrapper">
								<ZForm onSubmit={handleSubmit} resolver={zodResolver(videoSchema)}>
									<div className="single-input">
										<label htmlFor="productName">Title</label>
										<ZInput name="title" label="Zafran Hair Growth Therapy Oil" type="text" />
									</div>
									<div className="single-input">
										<label htmlFor="productName">just copy youtube video url And paste here</label>
										<ZInput name="url" label="youtube video url" type="text" />
									</div>

									<div className="button-area-botton-wrapper-p-list">
										<button type="submit" className="rts-btn btn-primary" disabled={isLoading}>
											{isLoading ? 'Saving...' : 'Save video'}
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
