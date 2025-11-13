'use client';

import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {selectLanguage, toggleLanguage} from '@/redux/features/language/languageSlice';

const LanguageSelector = () => {
	const dispatch = useDispatch();
	const language = useSelector(selectLanguage);

	const handleChange = () => {
		dispatch(toggleLanguage());
	};

	return (
		<div className="language-selector-container">
			<select value={language} onChange={handleChange} className="language-select">
				<option value="en">English</option>
				<option value="bn">বাংলা</option>
			</select>
		</div>
	);
};

export default LanguageSelector;
