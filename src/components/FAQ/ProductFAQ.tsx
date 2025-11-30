import {useState} from 'react';

import {useAppSelector} from '@/redux/hooks';
import {selectLanguage} from '@/redux/features/language/languageSlice';
import {IProduct} from '@/types/product.types';

const ProductFAQ = ({data}: {data: IProduct}) => {
	const language = useAppSelector(selectLanguage);
	const [activeId, setActiveId] = useState<number | null>(null);

	const toggleAccordion = (id: number) => {
		setActiveId(id === activeId ? null : id);
	};

	return (
		<div className="container d-none">
			<div className="accordion-container">
				{data?.faqs?.map((product: any, index: number) => (
					<div key={index} className="accordion-item">
						<button
							className={`accordion-header ${activeId === index ? 'active' : ''}`}
							onClick={() => toggleAccordion(index)}
						>
							{language === 'bn' ? product.b_question : product.question}
							<span className="icon">{activeId === index ? '-' : '+'}</span>
						</button>

						<div className={`accordion-content  ${activeId === index ? 'open' : ''}`}>
							<div className="faq-item border-0">
								<p className="question">
									<strong>A:</strong> {language === 'bn' ? product.b_answer : product.answer}
								</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default ProductFAQ;
