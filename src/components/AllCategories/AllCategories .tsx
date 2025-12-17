'use client';

import React, {useState, useEffect, useRef} from 'react';
import {useGetAllCategoriesQuery} from '@/redux/features/category/categoryApi';
import Link from 'next/link';
import './AllCategories.css';

interface Category {
	id: string;
	name: string;
	value: string;
	sub_categories: SubCategory[];
}

interface SubCategory {
	id: string;
	name: string;
	value: string;
}

const AllCategories = () => {
	const {data: categories, isLoading, error} = useGetAllCategoriesQuery('');
	const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
	const [showCategories, setShowCategories] = useState(false);
	const [activeCategory, setActiveCategory] = useState<string | null>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const subcategoryRefs = useRef<Map<string, HTMLDivElement>>(new Map());

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setShowCategories(false);
				setActiveCategory(null);
				setHoveredCategory(null);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	// Handle category click on mobile
	const handleCategoryClick = (categoryId: string, hasSubcategories: boolean) => {
		if (window.innerWidth <= 768 && hasSubcategories) {
			setActiveCategory(activeCategory === categoryId ? null : categoryId);
			setHoveredCategory(null); // Clear hover on mobile
		}
	};

	// Handle hover on desktop
	const handleMouseEnter = (categoryId: string, hasSubcategories: boolean) => {
		if (window.innerWidth > 768 && hasSubcategories) {
			setHoveredCategory(categoryId);
			setActiveCategory(null); // Clear active on desktop
		}
	};

	// Handle mouse leave on desktop
	const handleMouseLeave = (categoryId: string) => {
		if (window.innerWidth > 768) {
			// Delay hiding to allow moving cursor to subcategories
			setTimeout(() => {
				setHoveredCategory((prev) => (prev === categoryId ? null : prev));
			}, 100);
		}
	};

	// Handle subcategory container mouse enter
	const handleSubcategoryMouseEnter = () => {
		if (window.innerWidth > 768) {
			// Keep the parent category hovered when mouse is in subcategories
			setHoveredCategory(hoveredCategory);
		}
	};

	if (isLoading) {
		return (
			<div className="all-categories">
				<button className="categories-toggle" disabled>
					<i className="fas fa-spinner fa-spin me-2"></i>
					Loading...
				</button>
			</div>
		);
	}

	if (error) {
		return (
			<div className="all-categories">
				<button className="categories-toggle" disabled>
					<i className="fas fa-exclamation-circle me-2"></i>
					Error
				</button>
			</div>
		);
	}

	return (
		<div className="all-categories" ref={dropdownRef}>
			<button
				className="categories-toggle"
				onClick={() => {
					setShowCategories(!showCategories);
					setActiveCategory(null);
					setHoveredCategory(null);
				}}
				onMouseEnter={() => window.innerWidth > 768 && setShowCategories(true)}
			>
				<i className="fas fa-bars me-2"></i>
				All Categories
				<span className="categories-count">({categories?.length || 0})</span>
				<i className={`fas fa-chevron-${showCategories ? 'up' : 'down'} ms-2`}></i>
			</button>

			{showCategories && (
				<div
					className="categories-dropdown"
					onMouseEnter={() => window.innerWidth > 768 && setShowCategories(true)}
					onMouseLeave={() => {
						if (window.innerWidth > 768) {
							// Delay hiding to allow moving cursor
							setTimeout(() => {
								if (!hoveredCategory) {
									setShowCategories(false);
								}
							}, 200);
						}
					}}
				>
					<div className="categories-header">
						<h6 style={{margin: 0, fontSize: '16px', fontWeight: '600'}}>
							<i className="fas fa-layer-group me-2"></i>
							Browse Categories
						</h6>
						<button
							className="close-btn"
							onClick={() => {
								setShowCategories(false);
								setActiveCategory(null);
								setHoveredCategory(null);
							}}
						>
							<i className="fas fa-times"></i>
						</button>
					</div>

					<div className="categories-list">
						{categories?.map((category: Category) => {
							const hasSubcategories = category.sub_categories.length > 0;
							const isActive = activeCategory === category.id;
							const isHovered = hoveredCategory === category.id;

							return (
								<div
									key={category.id}
									className={`category-item ${isActive ? 'active' : ''}`}
									onMouseEnter={() => handleMouseEnter(category.id, hasSubcategories)}
									onMouseLeave={() => handleMouseLeave(category.id)}
								>
									<div className="main-category">
										<div className="category-content">
											<Link
												href={`/shop?category=${category.value}`}
												className="category-link"
												onClick={(e) => {
													if (window.innerWidth <= 768 && hasSubcategories) {
														e.preventDefault();
														handleCategoryClick(category.id, hasSubcategories);
													} else {
														setShowCategories(false);
													}
												}}
											>
												<span className="category-icon">
													<i
														className={`fas ${hasSubcategories ? 'fa-folder-open' : 'fa-folder'}`}
													></i>
												</span>
												<span className="category-name">{category.name}</span>
												{hasSubcategories && (
													<span className="category-arrow">
														<i
															className={`fas fa-chevron-${
																window.innerWidth <= 768
																	? isActive
																		? 'down'
																		: 'right'
																	: isHovered
																	? 'down'
																	: 'right'
															}`}
														></i>
													</span>
												)}
											</Link>
										</div>

										{/* Subcategories */}
										{hasSubcategories && (isHovered || isActive) && (
											<div
												className="subcategories-container"
												ref={(el) => {
													if (el) {
														subcategoryRefs.current.set(category.id, el);
													} else {
														subcategoryRefs.current.delete(category.id);
													}
												}}
												onMouseEnter={handleSubcategoryMouseEnter}
												onMouseLeave={() => window.innerWidth > 768 && setHoveredCategory(null)}
											>
												<div className="subcategories-list">
													{category.sub_categories.map((subCategory: SubCategory) => (
														<Link
															key={subCategory.id}
															href={`/shop?category=${category.value}&subcategory=${subCategory.value}`}
															className="subcategory-item"
															onClick={() => setShowCategories(false)}
														>
															<i className="fas fa-angle-right me-2"></i>
															{subCategory.name}
															<span
																className="text-muted"
																style={{fontSize: '12px', marginLeft: '8px'}}
															>
																({category.name})
															</span>
														</Link>
													))}
												</div>
											</div>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
};

export default AllCategories;
