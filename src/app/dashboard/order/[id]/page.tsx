// app/dashboard/page.tsx
'use client';
import {useState} from 'react';
import DemoContent from './DemoContent';
import SideLeft from '../../components/SideLeft';
import Header from '../../components/Header';

export default function Home() {
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

	const toggleSidebar = () => {
		setSidebarCollapsed(!sidebarCollapsed);
	};

	return (
		<div className="ekomart_dashboard">
			<SideLeft collapsed={sidebarCollapsed} />
			<div className={`right-area-body-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
				<Header onToggleSidebar={toggleSidebar} />
				<DemoContent />
			</div>
		</div>
	);
}
