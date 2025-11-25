import React from 'react';
import './DynamicTextRows.css';

type RowData = {
	id: number;
	question: string;
	answer: string;
};

const DynamicTextRows = ({
	rows,
	setRows,
	required = true,
}: {
	rows: RowData[];
	setRows: React.Dispatch<React.SetStateAction<RowData[]>>;
	required?: boolean;
}) => {
	// ✅ Universal Update Handler
	const handleChange = (id: number, key: keyof RowData, value: string) => {
		setRows(rows.map((row) => (row.id === id ? {...row, [key]: value} : row)));
	};

	const addRow = () => {
		const newId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 1;
		setRows([
			...rows,
			{
				id: newId,
				question: '',

				answer: '',
			},
		]);
	};

	const removeRow = (id: number) => {
		setRows(rows.filter((row) => row.id !== id));
	};

	return (
		<div className="dynamic-wrapper">
			{rows.map((row) => (
				<div key={row.id} className="dynamic-row">
					<span className="row-id">{row.id}.</span>
					<div className="col">
						<textarea
							placeholder="Enter Question (EN)"
							value={row.question}
							onChange={(e) => handleChange(row.id, 'question', e.target.value)}
							className="text-area mb-2"
							required={required}
						></textarea>
					</div>
					<div className="col">
						<textarea
							placeholder="Enter Answer (EN)"
							value={row.answer}
							onChange={(e) => handleChange(row.id, 'answer', e.target.value)}
							className="text-area mb-2"
							required={required}
						></textarea>
					</div>
					<button className="remove-btn-4" onClick={() => removeRow(row.id)}>
						✕
					</button>
				</div>
			))}

			{rows.length < 9 && (
				<button type="button" className="add-btn" onClick={addRow}>
					Add Item
				</button>
			)}
		</div>
	);
};

export default DynamicTextRows;
