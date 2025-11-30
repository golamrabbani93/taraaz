import React, {useEffect, useState} from 'react';
import './filterbar.css'; // <- custom CSS file
import {useGetAllCategoriesQuery} from '@/redux/features/category/categoryApi';

interface FilterBarProps {
	isSidebarOpen: boolean;
	setIsSidebarOpen: (open: boolean) => void;
	minPrice: number;
	maxPrice: number;
	setMinPrice: (price: number) => void;
	setMaxPrice: (price: number) => void;
	selectedCategories: string[];
	setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
	setAllCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

const FilterBar = ({
	isSidebarOpen,
	setIsSidebarOpen,
	minPrice,
	maxPrice,
	setMinPrice,
	setMaxPrice,
	selectedCategories,
	setSelectedCategories,
	setAllCategories,
}: FilterBarProps) => {
	const allBrands = ['Nike', 'Adidas', 'Puma', "Levi's"];
	const {data: categories} = useGetAllCategoriesQuery('');
	const [selectedBrands, setSelectedBrands] = useState([]);
	const allCategories = categories ? categories.map((cat: any) => cat.value) : [];
	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
	useEffect(() => {
		setAllCategories(allCategories);
	}, [categories]);
	return (
		<div className="filter-wrapper">
			{/* Toggle Button */}

			{/* Overlay */}
			{isSidebarOpen && <div className="filter-overlay" onClick={toggleSidebar}></div>}

			{/* Sidebar */}
			<aside className={`filter-sidebar ${isSidebarOpen ? 'open' : ''}`}>
				<button
					className="btn btn-danger mb-4"
					onClick={toggleSidebar}
					style={{
						position: 'absolute',
						top: '10px',
						right: '10px',
						zIndex: 3,
						padding: '5px 10px',
						borderRadius: '8px',
						fontSize: '16px',
						border: 'none',
						color: 'white',
						cursor: 'pointer',
						width: '40px',
					}}
				>
					<i className={`fa ${isSidebarOpen ? 'fa-times' : 'fa-filter'}`}></i>
				</button>
				{/* Section: Price */}
				<div className="filter-section mt-5 pt-5">
					<h4 className="filter-title">Price</h4>

					<div className="filter-row">
						<label>Min</label>
						<input
							type="number"
							value={minPrice}
							onChange={(e) => setMinPrice(+e.target.value)}
							className="input-box"
						/>
					</div>

					<div className="filter-row">
						<label>Max</label>
						<input
							type="number"
							value={maxPrice}
							onChange={(e) => setMaxPrice(+e.target.value)}
							className="input-box"
						/>
					</div>

					<input
						type="range"
						min="0"
						max="40000"
						value={maxPrice}
						onChange={(e) => setMaxPrice(+e.target.value)}
						className="range-slider"
					/>

					<p className="price-label">
						Price: {minPrice}৳ — {maxPrice}৳
					</p>
				</div>

				{/* Section: Categories */}
				{/* <div className="filter-section pb-5">
					<h4 className="filter-title">Categories</h4>

					{allCategories.map((cat: string, i: number) => (
						<label key={i} className="checkbox-item">
							<input
								type="checkbox"
								checked={selectedCategories.includes(cat)}
								onChange={() =>
									setSelectedCategories((prev: string[]) =>
										prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
									)
								}
							/>
							<span className="checkmark"></span>
							{cat}
						</label>
					))}
				</div> */}

				{/* Section: Brands */}
			</aside>
		</div>
	);
};

export default FilterBar;
