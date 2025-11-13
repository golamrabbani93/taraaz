export interface IBlog {
	id: number;
	title: string;
	b_title: string;
	b_content: string;
	slug: string;
	content: string;
	excerpt?: string;
	cover_image: string;
	author_name: string;
	author_image: string;
	tags?: any[];
	meta_title?: string;
	meta_description?: string;
	status?: string;
	published_at: any;
	created_at: string;
	updated_at: string;
	system_date: string;
}
