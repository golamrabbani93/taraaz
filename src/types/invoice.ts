// types/invoice.ts

export interface InvoiceItem {
	name: string;
	price: number; // Per unit price
	quantity: number;
	amount: number; // price * quantity (pre-calculated from backend)
}
