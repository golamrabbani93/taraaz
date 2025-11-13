// components/SideLeft.tsx
'use client';
import Image from 'next/image';
import SideMenu from './SideMenu';

interface SideLeftProps {
	collapsed: boolean;
}

function SideLeft({collapsed}: SideLeftProps) {
	return (
		<div className={`sidebar_left ${collapsed ? 'collapsed' : ''}`}>
			<a
				href="/dashboard"
				className="logo text-center d-block "
				style={{fontSize: '24px', fontWeight: '700'}}
			>
				Zafran-brand
			</a>
			<SideMenu />
		</div>
	);
}

export default SideLeft;
