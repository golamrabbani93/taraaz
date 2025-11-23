'use client';

import Link from 'next/link';
import {useState, useEffect} from 'react';
import ProductDetails from '@/components/modal/ProductDetails';
import {useCart} from '@/components/header/CartContext';
import {useWishlist} from '@/components/header/WishlistContext';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {IProduct} from '@/types/product.types';
import {useAppSelector} from '@/redux/hooks';
import {selectLanguage} from '@/redux/features/language/languageSlice';
import Image from 'next/image';

const BlogGridMain = ({product}: {product: IProduct}) => {
	const language = useAppSelector(selectLanguage);
	if (!product) {
		return null;
	}
	const {
		id,
		name: ProductTitle,
		b_name,
		slug: Slug,
		discount_price: Price,
		image1: ProductImage,
		image2,
		offer,
	} = product;
	type ModalType = 'one' | 'two' | 'three' | null;
	const [activeModal, setActiveModal] = useState<ModalType>(null);
	const handleClose = () => setActiveModal(null);
	const [quantity, setQuantity] = useState(1);
	const [imgError, setImgError] = useState(false);
	const {addToCart} = useCart();
	const {addToWishlist} = useWishlist();
	const [added, setAdded] = useState(false);
	const [wishlisted, setWishlisted] = useState(false);
	const original_Price = product.original_price?.split('.')[0] || 0; // Default to 0 if undefined
	const handleAdd = () => {
		addToCart({
			id,
			image: ProductImage ?? '',
			title: ProductTitle ?? 'Default Product Title',
			price: Price > 0 ? Price : Number(original_Price),
			quantity: quantity,
			active: true,
			b_name: b_name,
		});
		setAdded(true);
		setQuantity(1);
		setTimeout(() => setAdded(false), 5000);
	};

	const handleWishlist = () => {
		addToWishlist({
			id: id,
			image: ProductImage ?? '',
			title: ProductTitle ?? 'Default Product Title',
			price: Price > 0 ? Price : Number(original_Price),
			quantity: quantity,
			b_name: b_name,
		});
		setWishlisted(true);
		setQuantity(1);
		setTimeout(() => setWishlisted(false), 3000);
	};

	const addcart = () =>
		toast(language === 'en' ? 'Successfully Add To Cart !' : 'কার্টে সফলভাবে যোগ করা হয়েছে !');
	const wishList = () =>
		toast(
			language === 'en'
				? 'Successfully Add To Wishlist !'
				: 'পছন্দের তালিকায় সফলভাবে যোগ করা হয়েছে !',
		);

	return (
		<>
			<div className="image-and-action-area-wrapper overflow-hidden">
				<Link href={`/shop/${Slug}`} className="thumbnail-preview">
					{offer && (
						<div className="badge">
							<span>
								{offer} <br />
								Off
							</span>
							<i className="fa-solid fa-bookmark" />
						</div>
					)}
					{/* <img src={`${ProductImage}`} alt="grocery" /> */}
					{imgError ? (
						<img src={ProductImage} alt={ProductTitle} />
					) : (
						<Image
							src={ProductImage || '/images/placeholder/image-404.png'}
							alt={ProductTitle}
							layout="responsive"
							width={1200}
							height={600}
							onError={() => {
								setImgError(true);
							}}
							// style={{borderRadius: '10px'}}
						/>
					)}
				</Link>
				<div className="action-share-option">
					<span
						className="single-action openuptip message-show-action"
						data-flow="up"
						title={language === 'en' ? 'Add To Wishlist' : 'পছন্দ করুন'}
						onClick={() => {
							handleWishlist();
							wishList();
						}}
					>
						<i className="fa-light fa-heart" />
					</span>
					<span
						className="single-action openuptip cta-quickview product-details-popup-btn ms-1"
						data-flow="up"
						title={language === 'en' ? 'Quick View' : 'দ্রুত দেখুন'}
						onClick={() => setActiveModal('two')}
					>
						<i className="fa-regular fa-eye" />
					</span>
				</div>
			</div>

			<div className="body-content">
				<a href={`/shop/${Slug}`}>
					<h4 className="title">
						{language === 'en'
							? ProductTitle.length > 30
								? `${ProductTitle.slice(0, 30)}.....`
								: ProductTitle
							: b_name.length > 30
							? `${b_name.slice(0, 30)}.....`
							: b_name}
					</h4>
				</a>
				{/* <span className="availability">{weight} Pack</span> */}
				<div className="price-area">
					{Price > 0 ? (
						<>
							<span className="current">
								{`${Price}`}
								<span className="tk">TK</span>
							</span>
							<div className="previous">
								{`${original_Price}`}
								<span className="tk">৳</span>
							</div>
						</>
					) : (
						<div className="current d-flex justify-content-between align-items-center w-full">
							<div>
								{`${original_Price}`}
								<span className="tk">৳</span>
							</div>

							{/* <div>
								<span>
									<i className="fa-regular fa-eye" /> {product?.views}
								</span>
							</div> */}
						</div>
					)}
					<div className="mobile-quantity">
						<div className="cart-counter-action">
							<div className="quantity-edit">
								<input
									type="text"
									className="input"
									value={quantity}
									onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
								/>
								<div className="button-wrapper-action">
									<button
										className="button minus border-0"
										onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
									>
										<i className="fa-regular fa-chevron-down border-0" />
									</button>
									<button
										className="button plus border-0"
										onClick={() => setQuantity((prev) => prev + 1)}
									>
										+<i className="fa-regular fa-chevron-up border-0" />
									</button>
								</div>
							</div>
						</div>
					</div>
					<span className="me-1  desk-icon-view" style={{fontSize: '14px'}}>
						<i className="fa-regular fa-eye" /> {product?.views} views
					</span>
				</div>
				<div className="mobile-quantity-button flex-column">
					<div>
						<span className="me-1 d-block pb-1 pt-1" style={{fontSize: '12px'}}>
							<i className="fa-regular fa-eye" /> {product?.views} views
						</span>
					</div>
					<button
						className="rts-btn btn-primary add-to-card radious-sm with-icon border mt-0"
						onClick={(e) => {
							e.preventDefault();
							handleAdd();
							addcart();
						}}
					>
						{language === 'en' && <div className="btn-text">{added ? 'Added' : 'Add'}</div>}
						{language === 'bn' && (
							<div className="btn-text" style={{fontSize: '12px'}}>
								কিনুন
							</div>
						)}
						<div className="arrow-icon">
							<i className={added ? 'fa-solid fa-check' : 'fa-regular fa-cart-shopping'} />
						</div>
						<div className="arrow-icon">
							<i className={added ? 'fa-solid fa-check' : 'fa-regular fa-cart-shopping'} />
						</div>
					</button>
				</div>

				<div className="cart-counter-action">
					<div className="quantity-edit">
						<input
							type="text"
							className="input"
							value={quantity}
							onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
						/>
						<div className="button-wrapper-action  ">
							<button
								className="button minus border-0"
								onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
							>
								<i className="fa-regular fa-chevron-down border-0" />
							</button>
							<button
								className="button plus border-0"
								onClick={() => setQuantity((prev) => prev + 1)}
							>
								+<i className="fa-regular fa-chevron-up border-0" />
							</button>
						</div>
					</div>
					<button
						className="rts-btn btn-primary add-to-card radious-sm with-icon border "
						onClick={(e) => {
							e.preventDefault();
							handleAdd();
							addcart();
						}}
					>
						{language === 'en' && <div className="btn-text">{added ? 'Added' : 'Add'}</div>}
						{language === 'bn' && (
							<div className="btn-text" style={{fontSize: '12px'}}>
								কিনুন
							</div>
						)}

						<div className="arrow-icon">
							<i className={added ? 'fa-solid fa-check' : 'fa-regular fa-cart-shopping'} />
						</div>
						<div className="arrow-icon">
							<i className={added ? 'fa-solid fa-check' : 'fa-regular fa-cart-shopping'} />
						</div>
					</button>
				</div>
			</div>

			{/* <CompareModal show={activeModal === 'one'} handleClose={handleClose} /> */}
			<ProductDetails show={activeModal === 'two'} handleClose={handleClose} product={product} />
		</>
	);
};

export default BlogGridMain;
