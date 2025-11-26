'use client';

import React, {useEffect, useState} from 'react';
import deleteModalStyles from '../DeleteModal/DeleteModal.module.css';
import ZForm from '../form/ZForm';
import ZMultiSelect from '../form/ZMultiSelect';
import {sizeOptions} from '@/app/dashboard/edit-product/[id]/options';
import ZInput from '../form/ZInput';
import {set, size} from 'zod';
import {generateBarcode} from '@/utils/generateBarcode';
import {useUpdateProductMutation} from '@/redux/features/product/productApi';
import {catchAsync} from '@/utils/catchAsync';
import {toast} from 'react-toastify';

interface StockSize {
	size: string;
	stock: number;
	barcode: number;
}

interface ProductWithStocks {
	id: number;
	name: string;
	stocks: number;
	stocks_size?: StockSize[];
	size?: {label: string; value: string}[];
}

interface AddSizeStockModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm?: () => void;
	product: ProductWithStocks | null;
	loader?: boolean;
}

const AddSizeStockModal: React.FC<AddSizeStockModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	product,
	loader,
}) => {
	const [selectedSizes, setSelectedSizes] = useState<{label: string; value: string}[]>([]);
	const [defaultValues, setDefaultValues] = useState({});
	const [updateProduct, {isLoading}] = useUpdateProductMutation();
	const getStock = (size: string) => {
		const item = product?.stocks_size?.find((i: {size: string; stock: number}) => i.size === size);
		return item?.stock ?? '';
	};
	useEffect(() => {
		setDefaultValues({
			stock_XL: getStock('XL'),
			stock_L: getStock('L'),
			stock_S: getStock('S'),
			stock_M: getStock('M'),
			stock_XXL: getStock('XXL'),
			size: product?.size || [],
		});

		setSelectedSizes(
			product?.stocks_size?.map((item: {size: string}) => ({
				label: item.size,
				value: item.size,
			})) || [],
		);
	}, [product]);

	const handleSubmit = (data: any) => {
		const sizeStocks = selectedSizes.map((size, index) => ({
			size: size.value,
			stock: Number(data[`stock_${size.value}`] || 0),
			barcode:
				product?.stocks_size?.find((item: {size: string}) => item.size === size.value)?.barcode ||
				Number(generateBarcode('22')), // keep existing barcode if available
		}));

		catchAsync(async () => {
			const res = await updateProduct({
				id: product?.id || '',
				data: {
					stocks_size: sizeStocks,
					name: product?.name || '',
					size: data?.size || [],
				},
			}).unwrap();
			if (res?.id) {
				onClose();
				toast.success('Size stocks updated successfully!');
			} else {
				toast.error('Failed to update size stocks.');
			}
		});
	};
	if (!isOpen) return null;
	return (
		<div
			className={deleteModalStyles.modalOverlay}
			onClick={onClose}
			role="dialog"
			aria-modal="true"
			aria-labelledby="add-stock-modal-title"
		>
			<div className={deleteModalStyles.modalContent} onClick={(e) => e.stopPropagation()}>
				<h2 id="add-stock-modal-title">Add Stock for {product?.name}</h2>
				<div className="input-main-wrapper">
					{defaultValues && (
						<ZForm onSubmit={handleSubmit} defaultValues={defaultValues}>
							<div className="row">
								<div className="single-input col-md-12 ">
									<label htmlFor="productName">Size</label>
									<ZMultiSelect
										label="Select Sizes"
										name="size"
										options={sizeOptions}
										onChange={(values: any) => setSelectedSizes(values)}
									/>
								</div>
							</div>
							{selectedSizes.length > 0 && (
								<div className="row mt-3">
									<h5>Enter Stocks Per Size</h5>
									<div className="row">
										{selectedSizes.map((size, i) => (
											<div key={i} className="single-input col-md-6">
												<label>{size.label} Stock</label>
												<ZInput
													name={`stock_${size.value}`}
													type="number"
													label={`Stock for size ${size.label}`}
													height="40px"
												/>
											</div>
										))}
									</div>
								</div>
							)}
							<div className={deleteModalStyles.modalButtons}>
								<button
									className={`${deleteModalStyles.btn} ${deleteModalStyles.btnCancel}`}
									onClick={onClose}
								>
									Cancel
								</button>
								<button
									className={`${deleteModalStyles.btn} ${deleteModalStyles.btnDelete}`}
									onClick={onConfirm}
									disabled={selectedSizes.length === 0 || isLoading}
								>
									{isLoading ? 'Adding...' : 'Add Stock'}
								</button>
							</div>
						</ZForm>
					)}
				</div>
			</div>
		</div>
	);
};

export default AddSizeStockModal;
