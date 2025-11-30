import React from 'react';
import styles from './HomeCategory.module.css';
import Link from 'next/link';

const HomeCategory = () => {
	return (
		<div className="popular-product-col-7-area rts-section-gapBottom container pt-5 mb-4 pe-xl-0 d-none d-lg-block">
			<div className="container cover-card-main-over-white ">
				{/* <div className="row"></div> */}
				<div className={styles.parent}>
					<Link href="/shop?category=taraaz-fusion" className={styles.div1}>
						<div className={styles.overlay}></div>
						<span className={styles.categoryName}>Taraaz Fusion</span>
					</Link>

					<Link href="/shop?category=indian-wear" className={styles.div2}>
						<div className={styles.overlay}></div>
						<span className={styles.categoryName}>Indian Wear</span>
					</Link>

					<Link href="/shop?category=designer's-choice" className={styles.div3}>
						<div className={styles.overlay}></div>
						<span className={styles.categoryName}>Designer's Choice</span>
					</Link>

					<Link href="/shop?category=pakistani-wear" className={styles.div4}>
						<div className={styles.overlay}></div>
						<span className={styles.categoryName}>Pakistani Wear</span>
					</Link>

					<Link href="/shop?category=saree" className={styles.div5}>
						<div className={styles.overlay}></div>
						<span className={styles.categoryName}>Saree</span>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default HomeCategory;
