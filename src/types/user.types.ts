export interface TUser {
	id: number;
	name: string;
	email: string;
	password_hash: string;
	phone: string;
	address?: string;
	image?: any;
	role: string;
	is_active?: boolean;
	created_at?: string;
	updated_at?: string;
	system_date?: string;
}
