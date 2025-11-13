export interface FAQItem {
	question: string;
	b_question: string;
	answer: string;
	b_answer: string;
}

export interface FAQCategory {
	title: string;
	b_title: string;
	items: FAQItem[];
}
