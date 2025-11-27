'use client';

import {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import {useCart} from '@/components/header/CartContext';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useAppSelector} from '@/redux/hooks';
import {selectLanguage} from '@/redux/features/language/languageSlice';

interface ModalProps {
	show: boolean;
	handleClose: () => void;
	product: any;
}

const ProductDetails: React.FC<ModalProps> = ({show, handleClose, product}) => {
	const language = useAppSelector(selectLanguage);
	const {
		id,
		name: ProductTitle,
		slug: Slug,
		b_name,
		b_description,
		discountPrice: Price,
		image1: ProductImage,
		original_price: originalPrice,
		description,
		weight,
		offer,
	} = product;
	const [quantity, setQuantity] = useState(1);
	const [activeTab, setActiveTab] = useState<string>('tab1');
	const {addToCart} = useCart();

	const increaseQuantity = () => setQuantity((prev) => prev + 1);
	const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

	const priceNumber = parseFloat(originalPrice) || 0;
	const totalPrice = (priceNumber * quantity).toFixed(2);

	const addcart = () =>
		toast.success(
			language === 'en' ? 'Successfully Add To Cart !' : 'কার্টে সফলভাবে যোগ করা হয়েছে !',
		);

	const handleAdd = () => {
		const item = {
			id: id,
			image: ProductImage,
			title: ProductTitle,
			price: priceNumber,
			quantity: quantity,
			active: true,
			b_name: b_name,
		};

		addToCart(item);
		addcart();
	};

	return (
		<>
			<Modal
				show={show}
				onHide={handleClose}
				backdrop="static"
				keyboard={false}
				dialogClassName="modal-compare"
			>
				<div className="product-details-popup-wrapper popup">
					<div className="rts-product-details-section rts-product-details-section2 product-details-popup-section">
						<div className="product-details-popup">
							<button className="product-details-close-btn" onClick={handleClose}>
								<i className="fal fa-times" />
							</button>
							<div className="details-product-area">
								<div className="product-thumb-area">
									<div className="cursor" />
									<div className="thumb-wrapper one filterd-items figure">
										{activeTab === 'tab1' && (
											<div className="product-thumb zoom">
												<img src={ProductImage} alt="product-thumb" />
											</div>
										)}
										{activeTab === 'tab2' && (
											<div className="product-thumb zoom">
												<img src={ProductImage} alt="product-thumb" />
											</div>
										)}
										{activeTab === 'tab3' && (
											<div className="product-thumb zoom">
												<img src={ProductImage} alt="product-thumb" />
											</div>
										)}
									</div>
									<div className="product-thumb-filter-group">
										{['tab1', 'tab2', 'tab3'].map((tab) => (
											<div
												key={tab}
												onClick={() => setActiveTab(tab)}
												className={`thumb-filter filter-btn ${activeTab === tab ? 'active' : ''}`}
											>
												<img src={ProductImage} alt={`thumb-${tab}`} />
											</div>
										))}
									</div>
								</div>

								<div className="contents">
									<div className="product-status">
										<span className="product-catagory"></span>
										{/* <div className="rating-stars-group">
											<div className="rating-star">
												<i className="fas fa-star" />
											</div>
											<div className="rating-star">
												<i className="fas fa-star" />
											</div>
											<div className="rating-star">
												<i className="fas fa-star-half-alt" />
											</div>
											<span>10 Reviews</span>
										</div> */}
									</div>

									<h2 className="product-title">{language === 'en' ? ProductTitle : b_name}</h2>
									{/* {Price > 0 ? (
						<>
							<span className="current">
								{`${Price}`}
								<span className="tk">TK</span>
							</span>
							<div className="previous">
								{`${originalPrice}`}
								<span className="tk">TK</span>
							</div>
						</>
					) : (
						<div className="current">
							{`${originalPrice}`} <span className="tk">TK</span>
						</div>
					)} */}

									<span className="product-price">
										{Price > 0 ? (
											<>
												<span className="old-price">{`${originalPrice}`}</span>
												<span className="tk">৳</span> {Price}
												<span className="tk">৳</span>
											</>
										) : (
											<>
												{`${originalPrice}`} <span className="tk">৳</span>
											</>
										)}
									</span>

									<p>{language === 'en' ? description : b_description}</p>

									<div className="product-bottom-action">
										<div className="cart-edit">
											<div className="quantity-edit action-item">
												<button className="button" onClick={decreaseQuantity}>
													<i className="fal fa-minus minus" />
												</button>
												<input type="text" className="input" value={quantity} readOnly />
												<button className="button plus" onClick={increaseQuantity}>
													<i className="fal fa-plus plus" />
												</button>
											</div>
										</div>

										<a
											href="#"
											className="rts-btn btn-primary radious-sm with-icon"
											onClick={(e) => {
												e.preventDefault();
												handleAdd();
											}}
										>
											<div className="btn-text">
												{language === 'en' ? 'Add To Cart' : 'কার্টে যোগ করুন'}
											</div>
											<div className="arrow-icon">
												<i className="fa-regular fa-cart-shopping" />
											</div>
											<div className="arrow-icon">
												<i className="fa-regular fa-cart-shopping" />
											</div>
										</a>

										{/* <a href="javascript:void(0);" className="rts-btn btn-primary ml--20">
											<i className="fa-light fa-heart" />
										</a> */}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default ProductDetails;
