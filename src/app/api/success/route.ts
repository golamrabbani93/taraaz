import {NextRequest, NextResponse} from 'next/server';

export async function POST(req: NextRequest) {
	try {
		// get the query parameters
		const {searchParams} = new URL(req.url);
		const tran_id = searchParams.get('tran_id');
		const id = searchParams.get('orderId');
		const amount = searchParams.get('amount');
		const name = searchParams.get('name');
		const customer_id = searchParams.get('customer_id');

		//update order in database here
		const res = await fetch(`https://fitback.shop/zafran1Order/${id}`, {
			method: 'PUT',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				transaction_id: tran_id,
				payment_amount: amount,
				payment_status: 'paid',
				customer_name: name,
				user_id: customer_id,
				total_amount: amount,
			}),
		});
		const data = await res.json();
		// Redirect to success page
		if (data?.id) {
			return NextResponse.redirect(new URL('/payment/success', req.url), 303);
		} else {
			return NextResponse.redirect(new URL('/payment/failed', req.url), 303);
		}
	} catch (error) {
		console.log(error);
	}
}
