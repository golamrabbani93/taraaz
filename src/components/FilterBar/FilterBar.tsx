import React, {useState} from 'react';
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
}: FilterBarProps) => {
	const allBrands = ['Nike', 'Adidas', 'Puma', "Levi's"];
	const {data: categories} = useGetAllCategoriesQuery('');
	const [selectedBrands, setSelectedBrands] = useState([]);
	const allCategories = categories ? categories.map((cat: any) => cat.value) : [];
	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

	return (
		<div className="filter-wrapper">
			{/* Toggle Button */}

			{/* Overlay */}
			{isSidebarOpen && <div className="filter-overlay" onClick={toggleSidebar}></div>}

			{/* Sidebar */}
			<aside className={`filter-sidebar ${isSidebarOpen ? 'open' : ''}`}>
				<button className="close-btn mb-4" onClick={toggleSidebar}>
					Close
				</button>
				{/* Section: Price */}
				<div className="filter-section">
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
				<div className="filter-section pb-5">
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
				</div>

				{/* Section: Brands */}
			</aside>
		</div>
	);
};

export default FilterBar;
