import { customAlphabet } from 'nanoid';

export const generateBarcode = () => {
  const nanoid = customAlphabet('0123456789', 12);
  return nanoid(); // 12 digit barcode
};
