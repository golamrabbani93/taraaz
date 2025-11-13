import {NextRequest, NextResponse} from 'next/server';

export async function POST(req: NextRequest) {
	try {
		return NextResponse.redirect(new URL('/payment/fail', req.url), 303);
	} catch (error) {
		console.log(error);
	}
}
