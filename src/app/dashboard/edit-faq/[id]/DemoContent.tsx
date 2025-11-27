'use client';

import React, {useEffect, useState} from 'react';
import ZForm from '@/components/form/ZForm';
import ZInput from '@/components/form/ZInput';
import {FieldValues} from 'react-hook-form';
import DynamicTextRows from '@/components/DynamicTextRows/DynamicTextRows';
import {zodResolver} from '@hookform/resolvers/zod';
import {faqSchema} from '@/schemas/faq.schema';
import {useGetSingleFAQQuery, useUpdateFAQMutation} from '@/redux/features/faq/faqManagementApi';
import {catchAsync} from '@/utils/catchAsync';
import {toast} from 'react-toastify';
import {useParams} from 'next/navigation';
import DashboardLoader from '@/components/Loader/DashboardLoader/DashboardLoader';

const AddProductPage = () => {
	const {id} = useParams();
	const {data: faqData, isLoading} = useGetSingleFAQQuery(id);

	useEffect(() => {
		if (faqData && faqData.items) {
			setRows(faqData.items);
		}
	}, [faqData]);

	const [updateFAQ, {isLoading: isUpdating}] = useUpdateFAQMutation();
	const [rows, setRows] = useState([
		{id: 1, question: '', b_question: '', answer: '', b_answer: ''},
	]);
	const handleSubmit = async (data: FieldValues) => {
		data.items = rows;
		catchAsync(async () => {
			const result = await updateFAQ({id, data}).unwrap();
			if (result) {
			} else {
				// Handle failure (e.g., show an error message)
				toast.error('Failed to update FAQ');
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
									Update FAQ
								</h6>
							</div>

							<div className="input-main-wrapper">
								<ZForm
									onSubmit={handleSubmit}
									resolver={zodResolver(faqSchema)}
									defaultValues={faqData}
								>
									<div className="row">
										<div className="single-input col-md-6">
											<label htmlFor="productName">English Title</label>
											<ZInput name="title" label="English Title" type="text" />
										</div>
										<div className="single-input col-md-6">
											<label htmlFor="productName">Bangla Title </label>
											<ZInput name="b_title" label="Bangla Title " type="text" />
										</div>
										<label className="fw-bold" style={{color: '#000'}}>
											Enter FAQ Question And Answer
										</label>
										{/* <DynamicTextRows rows={rows} setRows={setRows} /> */}
									</div>

									<div className="button-area-botton-wrapper-p-list">
										<button type="submit" className="rts-btn btn-primary" disabled={isLoading}>
											{isUpdating ? 'Updating...' : 'Update FAQ'}
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
