'use client';
import DashboardLoader from '@/components/Loader/DashboardLoader/DashboardLoader';
import {
	useGetSingleOrderQuery,
	useUpdateOrderStatusMutation,
} from '@/redux/features/order/orderApi';
import {useGetAllProductsQuery} from '@/redux/features/product/productApi';
import {ItemsDaum} from '@/types/order.types';
import {IProduct} from '@/types/product.types';
import Link from 'next/link';
import {useParams} from 'next/navigation';
import React, {useEffect, useRef, useState} from 'react';
import {toast} from 'react-toastify';

const DemoContent: React.FC = () => {
	const {id} = useParams();

	const printRef = useRef<HTMLDivElement>(null);
	const {data: orderData, isLoading} = useGetSingleOrderQuery(id);
	const {data: productsData, isLoading: isProductsDataLoading} = useGetAllProductsQuery(undefined);
	const [updateProductStatus] = useUpdateOrderStatusMutation();
	//get order products from orderData.items_data
	const orderProducts = orderData?.items_data.map((item: ItemsDaum) => {
		const product = productsData?.find((p: IProduct) => p.id === item.product_id);
		return {
			...item,
			product_name: product ? product.name : 'Unknown',
			product_image: product ? product.image1 : '/assets/images-placeholder.png',
		};
	});
	const shippingCost = orderData?.provider == 'Outside Dhaka' ? 120 : 60;
	const [status, setStatus] = useState(orderData?.order_status);
	useEffect(() => {
		if (orderData) {
			setStatus(orderData.order_status);
		}
	}, [orderData]);
	// ✅ Format date
	const formatDate = (dateStr: string) => {
		const date = new Date(dateStr);
		return date.toLocaleDateString();
	};

	// ✅ Handle status update
	const handleUpdateStatus = async (newStatus: string) => {
		const data = {
			user_id: orderData?.user_id,
			customer_name: orderData?.customer_name,
			total_amount: orderData?.total_amount,
			order_status: newStatus,
		};
		const result = await updateProductStatus({id: orderData?.id, data: data});
		if (result?.data?.id) {
			toast.success('Order status updated successfully');
			setStatus(newStatus);
		}
	};

	if (isLoading || isProductsDataLoading) {
		return <DashboardLoader />;
	}
	return (
		<div ref={printRef}>
			<div className="body-root-inner">
				<div className="transection">
					<div className="title-right-actioin-btn-wrapper-product-list">
						<h3 className="title">Order #{orderData.id}</h3>
					</div>
					<div className="product-top-filter-area-l">
						<div className="left-area-button-fiulter">
							<p>Dashboard / Order / Order#{orderData.id}</p>
						</div>
					</div>
					<div className="vendor-list-main-wrapper product-wrapper">
						{/* Customer details */}
						<div className="customers-details-wrapper-one-dashboard">
							<h4 className="title">Customer Details</h4>
							<div className="main-customers-details-top">
								<div className="left">
									<img src="/assets/images-dashboard/avatar/03.png" alt="avatar" />
									<div className="information-area">
										<h4 className="name">{orderData.customer_name}</h4>
									</div>
								</div>
								<div className="right-area">
									<div className="short-contact-info">
										<p className="name">Email</p>
										<a href={`mailto:${orderData.customer_email}`}>{orderData.customer_email}</a>
									</div>
									<div className="short-contact-info">
										<p className="name">Number</p>
										<a href={`tel:${orderData.customer_phone}`}>{orderData.customer_phone}</a>
									</div>
									<div className="short-contact-info">
										<p className="name">Status</p>
										<select
											value={status}
											onChange={(e) => handleUpdateStatus(e.target.value)}
											className="nice-select"
										>
											<option value="pending">Pending</option>
											<option value="confirmed">Confirmed</option>
											<option value="shipped">Shipped</option>
											<option value="delivered">Delivered</option>
											<option value="cancelled">Cancelled</option>
										</select>
									</div>
									<div className="short-contact-info">
										<p className="name">Date</p>
										<span>{formatDate(orderData.created_at)}</span>
									</div>
									<div className="short-contact-info">
										<p className="name">Address</p>
										<span>{orderData.delivery_address}</span>
									</div>
								</div>
							</div>
						</div>

						{/* Billing Address */}
						<div className="billing-address-area-4">
							<h4 className="title">Payment Information</h4>
							<div className="main-billing-address-wrapper">
								<div className="single-billing-address">
									<p>
										<span>Payment Method :</span>{' '}
										{orderData.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
									</p>
									{orderData?.transaction_id && (
										<p>
											<span>Total Payment :</span> {orderData.total_amount}
										</p>
									)}
									{orderData.payment_method !== 'cod' && (
										<p>
											<span>Payment Status :</span> {orderData.payment_status}
										</p>
									)}
									{orderData?.transaction_id && (
										<p>
											<span>Transaction Id :</span> {orderData.transaction_id}
										</p>
									)}

									<p>
										<span>Shipping Method :</span> {orderData.provider}
									</p>
								</div>
							</div>
						</div>

						{/* Shipping Address */}
						<div className="billing-address-area-4">
							<h4 className="title">Shipping Address</h4>
							<div className="main-billing-address-wrapper">
								<div className="single-billing-address">
									<p>
										<span>Customer :</span> {orderData.customer_name}
									</p>
									<p>
										<span>Phone :</span> {orderData.customer_phone}
									</p>
									<p>
										<span>Address :</span> {orderData.delivery_address}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Order Summary */}
				<div className="order-details-table-1-table table-responsive">
					<h4 className="title">Order Summary</h4>
					<table className="table order-details-table table-responsive">
						<thead className="bg-active">
							<tr>
								<th style={{width: 300}}>Order Item</th>
								<th className="text-center">Price</th>
								<th className="text-center">Quantity</th>
								<th className="text-right">Total</th>
							</tr>
						</thead>
						<tbody>
							{orderProducts.map((item: any, index: number) => (
								<tr key={index}>
									<td>
										<div className="item">
											<div className="thumbnail">
												<img
													src={item.product_image}
													alt="product"
													style={{width: '100px', height: '100px', objectFit: 'contain'}}
												/>
											</div>
											<div className="discription">
												<h6 className="title">#{item.product_id}</h6>
												<span>{item?.product_name}</span>
											</div>
										</div>
									</td>
									<td className="text-center">{item.price} ৳</td>
									<td className="text-center">{item.quantity}</td>
									<td className="text-right">{item.price * item.quantity} ৳</td>
								</tr>
							))}
							<tr className="b-n">
								<td colSpan={3} className="text-end f-w-600">
									Total
								</td>
								<td className="text-right f-w-600">{orderData.total_amount - shippingCost} ৳</td>
							</tr>
							<tr className="b-n">
								<td colSpan={3} className="text-end f-w-600">
									Shipping Cost
								</td>
								<td className="text-right f-w-600">{shippingCost} ৳</td>
							</tr>
							<tr className="b-n">
								<td colSpan={3} className="text-end f-w-600">
									Grand Total
								</td>
								<td className="text-right f-w-600">{orderData.total_amount} ৳</td>
							</tr>
						</tbody>
					</table>

					<div className="buttons-area-invoice no-print mb--30">
						<Link
							href={`/invoice/${orderData.id}`}
							target="_blank"
							className="rts-btn btn-primary radious-sm with-icon"
							type="button"
						>
							<div className="btn-text">Print Now</div>
							<div className="arrow-icon">
								<i className="fa-regular fa-print" />
							</div>
							<div className="arrow-icon">
								<i className="fa-regular fa-print" />
							</div>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DemoContent;
