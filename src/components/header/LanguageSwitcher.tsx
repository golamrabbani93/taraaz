'use client';

import {useEffect, useState} from 'react';
// import './LanguageSwitcher.css';
import {useAppSelector} from '@/redux/hooks';
import {selectLanguage, setLanguage} from '@/redux/features/language/languageSlice';
import {useDispatch} from 'react-redux';

const LanguageSwitcher = () => {
	const [activeLang, setActiveLang] = useState<'en' | 'bn'>('en');
	const language = useAppSelector(selectLanguage);
	const dispatch = useDispatch();
	useEffect(() => {
		setActiveLang(language);
	}, [language]);

	const toggleLanguage = (lang: 'en' | 'bn') => {
		setActiveLang(lang);
		dispatch(setLanguage(lang));
	};
	return (
		<div className="language-switcher-container">
			<div className="language-switcher">
				<div
					className={`lang-option bn ${activeLang === 'bn' ? 'active-bn' : 'not-active-bn'}`}
					onClick={() => toggleLanguage('bn')}
				>
					{language === 'bn' ? 'বাং' : 'বাং'}
				</div>
				<div
					className={`lang-option en ${activeLang === 'en' ? 'active-en' : 'not-active-en'}`}
					onClick={() => toggleLanguage('en')}
				>
					{language === 'en' ? 'EN' : 'ইং'}
				</div>
			</div>
		</div>
	);
};

export default LanguageSwitcher;
