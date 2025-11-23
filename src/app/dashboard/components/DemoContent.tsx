import SelectedData from './SelectedData';
import DailySalesChart from './DailySalesChart';
import {useGetAllOrdersQuery} from '@/redux/features/order/orderApi';
import DashboardLoader from '@/components/Loader/DashboardLoader/DashboardLoader';
import {useGetAllCompanyContactsQuery} from '@/redux/features/companyContact/companyContact';

function DemoContent() {
	const {data: ordersData, isLoading} = useGetAllOrdersQuery('', {
		refetchOnMountOrArgChange: true,
		pollingInterval: 60000, // 60 seconds
	});
	const {data: countData, isLoading: isCountLoading} = useGetAllCompanyContactsQuery(undefined);
	if (isLoading || isCountLoading) {
		return <DashboardLoader />;
	}
	return (
		<div className="body-root-inner">
			<div className="transection">
				<div className="title-right-actioin-btn-wrapper-product-list">
					<h3 className="title">Taraaz Admin Dashboard</h3>
				</div>
			</div>

			<SelectedData ordersData={ordersData} countData={countData[0].country} />
			<div className="row mt--10 g-5">
				<DailySalesChart ordersData={ordersData} />
			</div>
		</div>
	);
}

export default DemoContent;
