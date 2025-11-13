import {useGetAllFAQsQuery} from '@/redux/features/faq/faqManagementApi';
import {useState} from 'react';
import MainLoader from '../Loader/MainLoader/MainLoader';
import {useAppSelector} from '@/redux/hooks';
import {selectLanguage} from '@/redux/features/language/languageSlice';
import {FAQCategory} from '@/types/faq.types';

const FAQ = () => {
	const language = useAppSelector(selectLanguage);
	const {data: faqData, isLoading} = useGetAllFAQsQuery('');
	const [activeId, setActiveId] = useState<number | null>(null);

	const toggleAccordion = (id: number) => {
		setActiveId(id === activeId ? null : id);
	};
	if (isLoading) {
		return <MainLoader />;
	}
	return (
		<div className="container">
			<div className="accordion-container">
				{faqData.map((product: FAQCategory, index: number) => (
					<div key={index} className="accordion-item">
						<button
							className={`accordion-header ${activeId === index ? 'active' : ''}`}
							onClick={() => toggleAccordion(index)}
						>
							{language === 'bn' ? product.b_title : product.title}
							<span className="icon">{activeId === index ? '-' : '+'}</span>
						</button>

						<div className={`accordion-content  ${activeId === index ? 'open' : ''}`}>
							{product.items.map((item, i) => (
								<div key={i} className="faq-item">
									<p className="question">
										<strong>Q:</strong> {language === 'bn' ? item.b_question : item.question}
									</p>
									<p className="answer">
										<strong>A:</strong> {language === 'bn' ? item.b_answer : item.answer}
									</p>
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default FAQ;
