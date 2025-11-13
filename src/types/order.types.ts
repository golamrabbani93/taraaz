export interface IOrder {
	id: number;
	user_id: string;
	customer_name: string;
	customer_email: string;
	customer_phone: string;
	delivery_address: string;
	items_data: ItemsDaum[];
	total_amount: string;
	order_status: string;
	payment_amount: any;
	payment_currency: string;
	payment_method: string;
	payment_status: string;
	transaction_id: string;
	provider: string;
	paid_at: any;
	created_at: string;
	updated_at: string;
	system_date: string;
}

export interface ItemsDaum {
	product_id: number;
	quantity: number;
	price: number;
}
