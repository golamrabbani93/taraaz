'use server';

import jwt from 'jsonwebtoken';
import {cookies} from 'next/headers';
// import {fetchUserInformation} from '../GenerateAllData';
import {TUser} from '@/types/user.types';
import {fetchUserInformation} from './fetchUserInformation';
import {jwtDecode} from 'jwt-decode';
const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET as string; // server-only

// ✅ Set token in cookies
export const setToken = async (userData: TUser) => {
	const payload = {
		id: userData.id,
		role: userData.role,
		email: userData.email,
	};

	const token = jwt.sign(payload, JWT_SECRET, {expiresIn: '30d'});

	const cookieStore = await cookies();
	cookieStore.set('accessToken', token, {
		httpOnly: true, // Cannot be accessed by JS
		secure: process.env.NODE_ENV === 'production',
		path: '/',
		sameSite: 'strict',
		maxAge: 60 * 60 * 24 * 30, // 30 days
	});
};

// ✅ Get current user from cookies
export const getCurrentUser = async () => {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get('accessToken')?.value;
	if (!accessToken) return null;

	try {
		// decode & verify token
		const decoded = (await jwtDecode(accessToken)) as {id: string; role: string; email: string};

		// Optional: fetch additional user info
		const userInformation = await fetchUserInformation(decoded.id);

		if (
			userInformation &&
			userInformation.role === decoded.role &&
			userInformation.email === decoded.email
		) {
			return userInformation; // return user object
		}

		return null;
	} catch (err) {
		console.log('Invalid or expired token', err);
		return null;
	}
};

// ✅ Remove token from cookies
export const removeToken = async () => {
	const cookieStore = await cookies();
	cookieStore.delete('accessToken');
};
