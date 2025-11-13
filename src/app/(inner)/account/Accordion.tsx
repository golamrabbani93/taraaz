'use client';

import ZForm from '@/components/form/ZForm';
import ZInput from '@/components/form/ZInput';
import MainLoader from '@/components/Loader/MainLoader/MainLoader';
import {useGetAllOrdersQuery} from '@/redux/features/order/orderApi';
import {useGetMyProfileQuery, useUpdateMyProfileMutation} from '@/redux/features/user/userApi';
import {clearUser, selectUser} from '@/redux/features/user/userSlice';
import {useAppDispatch, useAppSelector} from '@/redux/hooks';
import {checkoutSchema} from '@/schemas/checkout.schema';
import {removeToken} from '@/services/token/getToken';
import {zodResolver} from '@hookform/resolvers/zod';
import Link from 'next/link';
import {useState} from 'react';
import {toast} from 'react-toastify';

const AccountTabs = () => {
	const currentUser = useAppSelector(selectUser);
	const {data: allOrders, isLoading} = useGetAllOrdersQuery('');
	const {data: myProfile} = useGetMyProfileQuery(currentUser?.id);
	const [updateProfile, {isLoading: isUpdating}] = useUpdateMyProfileMutation();
	//get orders of current user and filter recent orders created_at
	const dispatch = useAppDispatch();
	const getMyOrders = allOrders
		?.filter((order: {user_id: string; created_at: string}) => order.user_id == currentUser?.id)
		.sort(
			(a: {created_at: string}, b: {created_at: string}) =>
				new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
		);

	const [activeTab, setActiveTab] = useState('dashboard');

	// Handle profile update
	const handleUpdateProfile = async (data: any) => {
		await updateProfile({
			id: currentUser?.id,
			...data,
			password_hash: myProfile?.password_hash,
		}).unwrap();
	};
	const handleLogOut = async () => {
		dispatch(clearUser());
		await removeToken();
		window.location.href = '/';
		toast.success('Logged out successfully');
	};
	if (isLoading) return <MainLoader />;
	return (
		<div className="account-tab-area-start rts-section-gap">
			<div className="container-2">
				<div className="row">
					<div className="col-lg-3">
						<div className="nav accout-dashborard-nav flex-column nav-pills me-3" role="tablist">
							<button
								className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
								onClick={() => setActiveTab('dashboard')}
							>
								<i className="fa-regular fa-chart-line"></i> Dashboard
							</button>
							<button
								className={`nav-link ${activeTab === 'order' ? 'active' : ''}`}
								onClick={() => setActiveTab('order')}
							>
								<i className="fa-regular fa-bag-shopping"></i> Order
							</button>

							<button
								className={`nav-link ${activeTab === 'account' ? 'active' : ''}`}
								onClick={() => setActiveTab('account')}
							>
								<i className="fa-regular fa-user"></i> Account Details
							</button>
							<button className="nav-link" onClick={() => handleLogOut()}>
								<i className="fa-light fa-right-from-bracket"></i> Log Out
							</button>
						</div>
					</div>
					<div className="col-lg-9 pl--50 pl_md--10 pl_sm--10 pt_md--30 pt_sm--30">
						<div className="tab-content">
							{activeTab === 'dashboard' && (
								<div className="dashboard-account-area">
									<h2 className="title">Hello {currentUser?.name}</h2>
									<p className="disc">
										From your account dashboard you can view your recent orders, manage your account
										details.
									</p>
								</div>
							)}

							{activeTab === 'order' && (
								<div className="order-table-account">
									<div className="h2 title">Your Orders</div>
									<div className="table-responsive">
										{getMyOrders && getMyOrders.length > 0 ? (
											<table className="table">
												<thead>
													<tr>
														<th>Order ID</th>
														<th>Date</th>
														<th>Status</th>
														<th>Total</th>
														<th>Payment Method</th>
														<th>Details</th>
													</tr>
												</thead>
												<tbody>
													{getMyOrders?.map((order: any) => (
														<tr key={order.id}>
															<td>#{order.id}</td>
															<td>{new Date(order?.created_at).toLocaleDateString()}</td>
															<td>{order?.order_status}</td>
															<td>
																{order?.items_data?.length} items - {order.total_amount} ৳
															</td>
															<td>
																{order.payment_method === 'cod'
																	? 'Cash on Delivery'
																	: 'Online Payment'}
															</td>
															<td>
																<Link href={`/invoice/${order.id}`}>
																	<button className="btn btn-primary" style={{fontSize: '12px'}}>
																		View Invoice
																	</button>
																</Link>
															</td>
														</tr>
													))}
												</tbody>
											</table>
										) : (
											<div className="text-center p-5">No orders found.</div>
										)}
									</div>
								</div>
							)}

							{activeTab === 'account' && (
								<div className="account-details-form-area">
									<ZForm
										onSubmit={handleUpdateProfile}
										defaultValues={myProfile}
										resolver={zodResolver(checkoutSchema)}
									>
										<h2 className="title">Account Details</h2>
										<div className="row input-half-area gap-2">
											<div className="col-12 col-md-6 single-input">
												<ZInput type="text" label="Full Name" name="name" />
											</div>
											<div className="col-12 col-md-6 single-input">
												<ZInput type="text" label="Email" name="email" />
											</div>
											<div className="col-12 col-md-6 single-input">
												<ZInput type="text" label="Phone" name="phone" />
											</div>
											<div className="col-12 col-md-6 single-input">
												<ZInput type="text" label="Address" name="address" />
											</div>
										</div>
										<button type="submit" className="rts-btn btn-primary">
											{isUpdating ? 'Updating...' : '	Update Details '}
										</button>
									</ZForm>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AccountTabs;
