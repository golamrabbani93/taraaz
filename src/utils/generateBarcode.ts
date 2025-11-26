import {customAlphabet} from 'nanoid';

export const generateBarcode = (prefix: string) => {
	// make sure prefix is exactly 2 digits
	const fixedPrefix = prefix.slice(0, 2);

	// remaining digits needed (12 total - 2 prefix)
	const remaining = 12 - fixedPrefix.length;

	const nanoid = customAlphabet('0123456789', remaining);

	return fixedPrefix + nanoid(); // final 12 digit barcode
};
