export interface IProduct {
	id: number;
	name: string;
	b_name: string;
	b_description: string;
	slug: string;
	offer?: string;
	discount_price?: any;
	original_price: string;
	tags: string[];
	meta_description: string;
	b_meta_description: string;
	image1?: string;
	image2?: string;
	image3?: any;
	image4?: any;
	image5?: any;
	video_link_list?: any[];
	weight: string;
	category?: string;
	categories?: ICategory;
	type: string;
	faqs?: any[];
	product_details?: string;
	description: string;
	reviews?: any[];
	views?: number;
	pin?: boolean;
	system_date?: string;
	isPublish?: boolean;
}

interface ICategory {
	label: string;
	value: string;
}
