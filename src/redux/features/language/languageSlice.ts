import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type LanguageState = {
	currentLanguage: 'en' | 'bn';
};

const initialState: LanguageState = {
	currentLanguage: 'en',
};

const languageSlice = createSlice({
	name: 'language',
	initialState,
	reducers: {
		toggleLanguage: (state) => {
			state.currentLanguage = state.currentLanguage === 'en' ? 'bn' : 'en';
		},
		setLanguage: (state, action: PayloadAction<'en' | 'bn'>) => {
			state.currentLanguage = action.payload;
		},
	},
});

export const {toggleLanguage, setLanguage} = languageSlice.actions;
export const selectLanguage = (state: {language: LanguageState}) => state.language.currentLanguage;
export default languageSlice.reducer;
