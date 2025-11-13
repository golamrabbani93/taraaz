export const catchAsync = (fn: () => Promise<void>) => {
	fn().catch((err) => console.error(err));
};
