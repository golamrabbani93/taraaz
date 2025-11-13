import {NextResponse} from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const url = req.headers.get('origin');
		const tran_id = crypto.randomBytes(10).toString('hex');
		const res = await fetch('https://fitback.shop/zafran1Order/new', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				user_id: body.id,
				customer_email: body.email,
				customer_name: body.name,
				total_amount: body.amount, //60 is shipping cost
				customer_phone: body.phone,
				delivery_address: body.address,
				items_data: body.items_data,
				order_status: 'pending',
				payment_status: 'failed',
				payment_method: 'sslcommerz',
				provider: body.provider,
			}),
		});
		const orderData = await res.json();
		// Required data
		const data = {
			store_id: process.env.NEXT_PUBLIC_SSLCOMMERZ_STORE_ID, // put your sandbox store id in .env
			store_passwd: process.env.NEXT_PUBLIC_SSLCOMMERZ_STORE_PASSWORD, // put your sandbox store password in .env
			total_amount: body.amount || '100',
			currency: 'BDT',
			tran_id: tran_id, // use unique tran_id for each api call
			success_url: `${url}/api/success?tran_id=${tran_id}&orderId=${orderData?.id}&amount=${orderData?.total_amount}&name=${body.name}&customer_id=${orderData?.user_id}`,
			fail_url: `${url}/api/failed?tran_id=${tran_id}`,
			cancel_url: `${url}/api/failed?tran_id=${tran_id}`,

			// Customer info
			cus_name: body.name || 'Test Customer',
			cus_email: body.email || 'test@test.com',
			cus_add1: body.address || 'Dhaka City',
			cus_city: 'Dhaka City',
			cus_postcode: '1200 ',
			cus_country: 'Bangladesh',
			cus_phone: body.phone || '01711111111',

			// Product info
			shipping_method: 'NO',
			product_name: body.product || 'Test Product',
			product_category: 'Electronic',
			product_profile: 'general',
		};

		// Send request to SSLCommerz
		const response = await fetch('https://sandbox.sslcommerz.com/gwprocess/v4/api.php', {
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
			body: new URLSearchParams(data as any).toString(),
		});

		const result = await response.json();

		if (result?.status === 'FAILED') {
			console.error('SSLCommerz Payment Failed:', result);
			return NextResponse.json({error: result}, {status: 400});
		}

		return NextResponse.json(result);
	} catch (error) {
		console.error('SSLCommerz Init Error:', error);
		return NextResponse.json({error: 'Something went wrong'}, {status: 500});
	}
}
