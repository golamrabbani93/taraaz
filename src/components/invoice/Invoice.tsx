'use client';

import React, {useRef} from 'react';
import {useReactToPrint} from 'react-to-print';
import styles from './Invoice.module.css';
import {useGetSingleOrderQuery} from '@/redux/features/order/orderApi';
import {useGetAllProductsQuery} from '@/redux/features/product/productApi';
import {IProduct} from '@/types/product.types';
import {useAppSelector} from '@/redux/hooks';
import {selectLanguage} from '@/redux/features/language/languageSlice';
import DashboardLoader from '../Loader/DashboardLoader/DashboardLoader';

interface InvoiceProps {
	id?: string;
}

interface IOrderItemData {
	name?: string;
	b_name?: string;
	price: number;
	product_id: number;
	quantity: number;
	amount?: number;
}

const Invoice: React.FC<InvoiceProps> = ({id}) => {
	const {data: singleOrder, isLoading} = useGetSingleOrderQuery(id!);
	const {data: products} = useGetAllProductsQuery(undefined);
	const language = useAppSelector(selectLanguage);
	// filter orderd products
	const orderedProducts = products?.filter((product: IProduct) =>
		singleOrder?.items_data?.some((item: IOrderItemData) => item.product_id === product.id),
	);
	// map through orderd products and get quantity and price from order data
	const finalData = orderedProducts?.map((product: IProduct) => {
		const orderItem = singleOrder?.items_data.find(
			(item: IOrderItemData) => item.product_id === product.id,
		);
		return {
			name: language === 'bn' ? product.b_name : product.name,
			price: orderItem ? orderItem.price : 0,
			quantity: orderItem ? orderItem.quantity : 0,
			amount: orderItem ? orderItem.price * orderItem.quantity : 0,
		};
	});

	//get product totals
	const productTotals = finalData?.reduce(
		(sum: number, item: IOrderItemData) => sum + (item.amount ?? 0),
		0,
	);

	const componentRef = useRef<HTMLDivElement>(null);

	const totals = singleOrder?.total_amount;

	// ✅ Updated react-to-print hook (v3+)
	const handlePrint = useReactToPrint({
		contentRef: componentRef,
		documentTitle: `Invoice-${singleOrder?.id || ''}`,
		pageStyle: `
			@page { 
			size: A4; 
			margin: 20mm; 
		}
		body {
			-webkit-print-color-adjust: exact; 
			font-size: 12pt;
		}
		.container {
			page-break-inside: avoid; /* Prevent splitting container */
		}
		table, tr, td, th {
			page-break-inside: avoid; /* Prevent table rows from breaking */
		}
	
		`,
	});
	if (isLoading) {
		return (
			<div>
				<DashboardLoader />
			</div>
		);
	}

	if (!singleOrder) {
		return <div className="text-center p-5">No order found.</div>;
	}
	return (
		<div>
			<div className={styles.container} ref={componentRef}>
				{/* Header */}
				<div className={styles.header}>
					<img src="/assets/images/logo/1.png" alt="" />
					<p>
						98/A, 3rd Colony, Mazar Road, Mirpur, Dhaka 1216, Bangladesh | Phone: +8801711113039 |
						Email: zafranoil@yahoo.com
					</p>
				</div>

				{/* Invoice Details */}
				<div className={styles.invoiceDetails}>
					<div className={styles.invoiceMeta}>
						<p style={{marginBottom: '-10px'}}>
							<strong>Invoice #:</strong> {singleOrder?.id}
						</p>
						<p style={{marginBottom: '-10px'}}>
							<strong>Date:</strong>{' '}
							{singleOrder?.created_at
								? new Date(singleOrder.created_at).toISOString().split('T')[0]
								: ''}
						</p>
						<p style={{marginBottom: '-10px'}}>
							<strong>Payment Method:</strong>{' '}
							{singleOrder?.payment_method === 'cod'
								? 'Cash on Delivery'
								: singleOrder?.payment_method === 'sslcommerz'
								? 'Online Payment'
								: ''}
						</p>
						{singleOrder?.transaction_id && (
							<p style={{marginBottom: '-10px'}}>
								<strong>Transaction ID: </strong>
								{singleOrder?.transaction_id}
							</p>
						)}
					</div>
					<div className={styles.customerInfo}>
						<h3 style={{marginBottom: '-23px'}}>Name: {singleOrder?.customer_name}</h3>
						<p style={{marginBottom: '-9px'}}>Phone: {singleOrder?.customer_phone}</p>
						<p style={{marginBottom: '-9px'}}>Email: {singleOrder?.customer_email}</p>
						<p>Address: {singleOrder?.delivery_address}</p>
					</div>
				</div>

				{/* Items Table */}
				<table className={styles.table}>
					<thead>
						<tr>
							<th>Item Name</th>
							<th>Price</th>
							<th>Quantity</th>
							<th className={styles.amount}>Amount</th>
						</tr>
					</thead>
					<tbody>
						{finalData?.map((item: IOrderItemData, index: number) => (
							<tr key={index}>
								<td>{item.name}</td>
								<td>৳{item.price.toFixed(2)}</td>
								<td>{item.quantity}</td>
								<td className={styles.amount}>৳{(item.amount ?? 0).toFixed(2)}</td>
							</tr>
						))}
					</tbody>
				</table>

				{/* Totals */}
				<div className={styles.totals}>
					<p>Subtotal: ৳ {productTotals?.toFixed(2)}</p>

					<hr style={{border: 'none', borderTop: '1px solid #ddd', margin: '10px 0'}} />
					<p>
						Shipping Cost: ৳{' '}
						{singleOrder?.provider === 'Outside Dhaka' ? (120.0).toFixed(2) : (60.0).toFixed(2)}
					</p>
					<hr style={{border: 'none', borderTop: '1px solid #ddd', margin: '10px 0'}} />
					<p className={styles.total}>Total: ৳ {Number(singleOrder?.total_amount)?.toFixed(2)}</p>
				</div>

				{/* Footer */}
				<div className={styles.footer}>
					<p style={{margin: 0}}>
						Powered by <span style={{fontWeight: 'bold'}}> ZafranShopBD</span>
					</p>
					<span>Note: This is a computer-generated document and does not require a signature.</span>
				</div>
			</div>

			{/* Actions */}
			{/* <div className="d-flex justify-content-center">
				<button className="rts-btn btn-primary mb-5" onClick={handlePrint}>
					Print / Download PDF
				</button>
			</div> */}
			<div className="buttons-area-invoice no-print mb--30">
				<button
					className="rts-btn btn-primary radious-sm with-icon"
					onClick={handlePrint}
					type="button"
				>
					<div className="btn-text">Print Now</div>
					<div className="arrow-icon">
						<i className="fa-regular fa-print" />
					</div>
					<div className="arrow-icon">
						<i className="fa-regular fa-print" />
					</div>
				</button>
			</div>
		</div>
	);
};

export default Invoice;
