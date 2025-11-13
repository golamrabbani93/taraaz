import {IOrder} from '@/types/order.types';
import CountUp from 'react-countup';
const SelectedData = ({ordersData, countData}: {ordersData: IOrder[]; countData: String}) => {
	const totalOrderTaka = ordersData
		? ordersData.reduce(
				(acc: number, order: {total_amount: string}) => acc + (Number(order.total_amount) || 0),
				0,
		  )
		: 0;
	const totalOrders = ordersData ? ordersData.length : 0;
	const pendingOrders = ordersData
		? ordersData.filter((order: {order_status: string}) => order.order_status === 'pending').length
		: 0;
	const confirmedOrders = ordersData
		? ordersData.filter((order: {order_status: string}) => order.order_status === 'confirmed')
				.length
		: 0;
	const completedOrders = ordersData
		? ordersData.filter((order: {order_status: string}) => order.order_status === 'delivered')
				.length
		: 0;
	const shippedOrders = ordersData
		? ordersData.filter((order: {order_status: string}) => order.order_status === 'shipped').length
		: 0;
	const cancelledOrders = ordersData
		? ordersData.filter((order: {order_status: string}) => order.order_status === 'cancelled')
				.length
		: 0;
	const todayOrders = ordersData
		? ordersData.filter((order: {created_at: string}) => {
				const orderDate = new Date(order.created_at);
				const today = new Date();

				return (
					orderDate.getDate() === today.getDate() &&
					orderDate.getMonth() === today.getMonth() &&
					orderDate.getFullYear() === today.getFullYear()
				);
		  })
		: [];
	return (
		<div>
			<div className="row g-5 justify-content-center">
				<div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12">
					<div className="single-over-fiew-card">
						<span className="top-main">Total Visitor</span>
						<div className="bottom">
							<h2 className="title">
								<i className="fas fa-eye me-2"></i>
								<CountUp start={0} end={Number(countData)} duration={2.75} separator="," />
							</h2>
						</div>
					</div>
				</div>
				<div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12">
					<div className="single-over-fiew-card">
						<span className="top-main">Total Order</span>
						<div className="bottom">
							<h2 className="title">
								<i className="fas fa-box me-2"></i>
								<CountUp start={0} end={totalOrders} duration={2.75} separator="," />
							</h2>
						</div>
					</div>
				</div>
				<div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12">
					<div className="single-over-fiew-card">
						<span className="top-main">Today's Order</span>
						<div className="bottom">
							<h2 className="title">
								<i className="fas fa-clock me-2"></i>
								<CountUp start={0} end={todayOrders?.length} duration={2.75} separator="," />
							</h2>
						</div>
					</div>
				</div>
				<div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12">
					<div className="single-over-fiew-card">
						<span className="top-main">Total Taka</span>
						<div className="bottom">
							<h2 className="title text-primary">
								<i className="fas fa-bangladeshi-taka-sign me-2"></i>

								<CountUp start={0} end={totalOrderTaka} duration={2.75} separator="," />
							</h2>
						</div>
					</div>
				</div>
				<div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12">
					<div className="single-over-fiew-card">
						<span className="top-main">Pending Orders</span>
						<div className="bottom">
							<h2 className="title text-primary">
								<i className="fas fa-hourglass-start me-2"></i>

								<CountUp start={0} end={pendingOrders} duration={2.75} separator="," />
							</h2>
						</div>
					</div>
				</div>

				{/* <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12">
					<div className="single-over-fiew-card">
						<span className="top-main">Confirmed Orders</span>
						<div className="bottom">
							<h2 className="title text-primary">
								<i className="fas fa-check-circle me-2"></i>

								<CountUp start={0} end={confirmedOrders} duration={2.75} separator="," />
							</h2>
						</div>
					</div>
				</div> */}
				<div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12">
					<div className="single-over-fiew-card">
						<span className="top-main">Shipped Orders</span>
						<div className="bottom">
							<h2 className="title text-primary">
								<i className="fas fa-shipping-fast me-2"></i>

								<CountUp start={0} end={shippedOrders} duration={2.75} separator="," />
							</h2>
						</div>
					</div>
				</div>
				<div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12">
					<div className="single-over-fiew-card">
						<span className="top-main">Delivered Orders</span>
						<div className="bottom">
							<h2 className="title text-primary">
								<i className="fas fa-handshake-angle me-2"></i>

								<CountUp start={0} end={completedOrders} duration={2.75} separator="," />
							</h2>
						</div>
					</div>
				</div>
				<div className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12">
					<div className="single-over-fiew-card">
						<span className="top-main">Canceled Orders</span>
						<div className="bottom">
							<h2 className="title text-primary">
								<i className="fas fa-ban me-2"></i>

								<CountUp start={0} end={cancelledOrders} duration={2.75} separator="," />
							</h2>
						</div>
					</div>
				</div>
			</div>

			{/* <div className='row mt--10 g-5'>
                    <ApexChartOne />
                    <ApexChartTwo />
                    <TopProductCountries />
                    <OtherBestSeller />
                </div>  */}
		</div>
	);
};

export default SelectedData;
