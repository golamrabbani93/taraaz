'use client';
import {createContext, useContext, useState, useEffect, ReactNode} from 'react';

// Define the theme type
interface Theme {
	'--color-primary': string; // Now stores a linear-gradient
	'--color-secondary': string;
	'--color-body': string;
	'--color-heading-1': string;
	'--color-white': string;
	'--color-success': string;
	'--color-danger': string;
	'--color-warning': string;
	'--color-info': string;
	'--color-facebook': string;
	'--color-twitter': string;
	'--color-youtube': string;
	'--color-linkedin': string;
	'--color-pinterest': string;
	'--color-instagram': string;
	'--color-vimeo': string;
	'--color-twitch': string;
	'--color-discord': string;
	'--color-border'?: string;
}

// Define context type
interface ThemeContextType {
	theme: string;
	setTheme: (theme: string) => void;
}

// Theme definitions with gradient primary colors
const themes: Record<string, Theme> = {
	light: {
		'--color-primary': '#629D23',
		'--color-secondary': '#1F1F25',
		'--color-body': '#6E777D',
		'--color-heading-1': '#2C3C28',
		'--color-white': '#fff',
		'--color-success': '#3EB75E',
		'--color-danger': '#DC2626',
		'--color-warning': '#FF8F3C',
		'--color-info': '#1BA2DB',
		'--color-facebook': '#3B5997',
		'--color-twitter': '#1BA1F2',
		'--color-youtube': '#ED4141',
		'--color-linkedin': '#0077B5',
		'--color-pinterest': '#E60022',
		'--color-instagram': '#C231A1',
		'--color-vimeo': '#00ADEF',
		'--color-twitch': '#6441A3',
		'--color-discord': '#7289da',
		'--color-border': '#e5e5e5',
	},
	dark: {
		'--color-primary': '#8BC34A',
		'--color-secondary': '#33333A',
		'--color-body': '#A0A7AD',
		'--color-heading-1': '#4A5A46',
		'--color-white': '#f0f0f0',
		'--color-success': '#54C774',
		'--color-danger': '#EF4444',
		'--color-warning': '#FFA559',
		'--color-info': '#38BDF8',
		'--color-facebook': '#4A6BB0',
		'--color-twitter': '#2AB3F4',
		'--color-youtube': '#FF5555',
		'--color-linkedin': '#1A91D0',
		'--color-pinterest': '#F5193B',
		'--color-instagram': '#D94AB7',
		'--color-vimeo': '#19C1FF',
		'--color-twitch': '#7B54B9',
		'--color-discord': '#879AE8',
		'--color-border': '#44444E',
	},
	blue: {
		'--color-primary': '#1E88E5',
		'--color-secondary': '#0D1B2A',
		'--color-body': '#778DA9',
		'--color-heading-1': '#1B263B',
		'--color-white': '#F5F7FA',
		'--color-success': '#3EB75E',
		'--color-danger': '#DC2626',
		'--color-warning': '#FF8F3C',
		'--color-info': '#1BA2DB',
		'--color-facebook': '#3B5997',
		'--color-twitter': '#1BA1F2',
		'--color-youtube': '#ED4141',
		'--color-linkedin': '#0077B5',
		'--color-pinterest': '#E60022',
		'--color-instagram': '#C231A1',
		'--color-vimeo': '#00ADEF',
		'--color-twitch': '#6441A3',
		'--color-discord': '#7289da',
		'--color-border': '#d1e3f0',
	},
	// fe702f
	// fc5781
	red: {
		'--color-primary': 'linear-gradient(135deg, #fe702f 0%, #fc5781 100%)',
		'--color-secondary': '#2C0B0B',
		'--color-body': '#fc5781',
		'--color-heading-1': '#3F1C1C',
		'--color-white': '#FFF5F5',
		'--color-success': '#3EB75E',
		'--color-danger': '#DC2626',
		'--color-warning': '#FF8F3C',
		'--color-info': '#1BA2DB',
		'--color-facebook': '#3B5997',
		'--color-twitter': '#1BA1F2',
		'--color-youtube': '#ED4141',
		'--color-linkedin': '#0077B5',
		'--color-pinterest': '#E60022',
		'--color-instagram': '#C231A1',
		'--color-vimeo': '#00ADEF',
		'--color-twitch': '#6441A3',
		'--color-discord': '#7289da',
		'--color-border': '#ffe1e1',
	},
	purple: {
		'--color-primary': '#7B1FA2',
		'--color-secondary': '#1C0B2B',
		'--color-body': '#9575CD',
		'--color-heading-1': '#2E1A47',
		'--color-white': '#F3E8FF',
		'--color-success': '#3EB75E',
		'--color-danger': '#DC2626',
		'--color-warning': '#FF8F3C',
		'--color-info': '#1BA2DB',
		'--color-facebook': '#3B5997',
		'--color-twitter': '#1BA1F2',
		'--color-youtube': '#ED4141',
		'--color-linkedin': '#0077B5',
		'--color-pinterest': '#E60022',
		'--color-instagram': '#C231A1',
		'--color-vimeo': '#00ADEF',
		'--color-twitch': '#6441A3',
		'--color-discord': '#7289da',
		'--color-border': '#e6d4f5',
	},
	green: {
		'--color-primary': '#2E7D32',
		'--color-secondary': '#0A1F0F',
		'--color-body': '#78909C',
		'--color-heading-1': '#1B3C1F',
		'--color-white': '#E8F5E9',
		'--color-success': '#3EB75E',
		'--color-danger': '#DC2626',
		'--color-warning': '#FF8F3C',
		'--color-info': '#1BA2DB',
		'--color-facebook': '#3B5997',
		'--color-twitter': '#1BA1F2',
		'--color-youtube': '#ED4141',
		'--color-linkedin': '#0077B5',
		'--color-pinterest': '#E60022',
		'--color-instagram': '#C231A1',
		'--color-vimeo': '#00ADEF',
		'--color-twitch': '#6441A3',
		'--color-discord': '#7289da',
		'--color-border': '#c8e6c9',
	},
};
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{children: ReactNode}> = ({children}) => {
	const [theme, setTheme] = useState<string>('red');

	useEffect(() => {
		const root = document.documentElement;
		const selectedTheme: Theme = themes[theme] || themes.light; // Fallback to light theme

		Object.entries(selectedTheme).forEach(([key, value]) => {
			root.style.setProperty(key, value);
		});
	}, [theme]);

	return <ThemeContext.Provider value={{theme, setTheme}}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}
	return context;
};
