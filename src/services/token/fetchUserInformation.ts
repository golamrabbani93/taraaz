// fetch user information using native fetch
export const fetchUserInformation = async (id: string) => {
	try {
		const res = await fetch(`https://taraz.qwikbistro.shop/tarazUser/${id}`, {
			method: 'GET',
			headers: {
				Authorization: `Token ${process.env.NEXT_PUBLIC_TOKEN}`,
				'Content-Type': 'application/json',
			},
		});

		if (!res.ok) {
			throw new Error(`Failed to fetch user data: ${res.status} ${res.statusText}`);
		}

		const data = await res.json();
		return data;
	} catch (error) {
		console.error('Error fetching user data:', error);
		throw error;
	}
};
