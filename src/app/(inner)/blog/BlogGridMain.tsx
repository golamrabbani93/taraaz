'use client';
import React from 'react';
import Link from 'next/link';
import {useAppSelector} from '@/redux/hooks';
import {selectLanguage} from '@/redux/features/language/languageSlice';

interface BlogGridMainProps {
	Slug: string;
	blogImage: string;
	blogTitle?: string;
	timestamp?: string;
	b_title?: string;
}

const BlogGridMain: React.FC<BlogGridMainProps> = ({
	Slug,
	blogImage,
	blogTitle,
	timestamp,
	b_title,
}) => {
	const language = useAppSelector(selectLanguage);
	return (
		<>
			<Link href={`/blog/${Slug}`} className="thumbnail">
				<img src={blogImage} alt="blog-area" />
			</Link>
			<div className="inner-content-body">
				<div className="tag-area">
					<div className="single">
						<i className="fa-light fa-clock" />
						<span>
							{new Date(timestamp || '').toLocaleDateString(language === 'en' ? 'en-US' : 'bn-BD', {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})}
						</span>
					</div>
				</div>
				<a className="title-main" href={`/blog/${Slug}`}>
					<h3 className="title animated fadeIn">
						{blogTitle ? (language === 'en' ? blogTitle : b_title) : 'How to growing your business'}
					</h3>
				</a>
				<div className="button-area">
					<Link href={`/blog/${Slug}`} className="rts-btn btn-primary radious-sm with-icon">
						<div className="btn-text">{language === 'en' ? 'Read Details' : 'বিস্তারিত পড়ুন'}</div>
						<div className="arrow-icon">
							<i className="fa-solid fa-circle-plus" />
						</div>
						<div className="arrow-icon">
							<i className="fa-solid fa-circle-plus" />
						</div>
					</Link>
				</div>
			</div>
		</>
	);
};

export default BlogGridMain;
