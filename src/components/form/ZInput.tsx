'use client';

import React from 'react';
import {useFormContext} from 'react-hook-form';

interface ZInputProps {
	type: string;
	label: string;
	name: string;
	isReadOnly?: boolean;
	disabled?: boolean;
	height?: string;
}
export default function ZInput({
	type,
	label,
	name,
	isReadOnly = false,
	disabled = false,
	height = '75px',
}: ZInputProps) {
	const {
		register,
		formState: {errors},
	} = useFormContext();

	return (
		<div className="mb-4">
			<input
				id={name}
				{...register(name)}
				type={type}
				placeholder={label}
				readOnly={isReadOnly}
				disabled={disabled}
				className={``}
				style={{height: height}}
			/>
			{errors[name]?.message && (
				<span className="text-danger mt-1" style={{fontSize: '12px'}}>
					{String(errors[name]?.message)}
				</span>
			)}
		</div>
	);
}
