'use client';

import React from 'react';
import {useFormContext} from 'react-hook-form';

interface ZTextAreaProps {
	name: string;
	isReadOnly?: boolean;
	disabled?: boolean;
}

export default function ZTextArea({name, isReadOnly = false, disabled = false}: ZTextAreaProps) {
	const {
		register,
		formState: {errors},
	} = useFormContext();

	return (
		<div className="mb-4">
			<textarea
				id={name}
				{...register(name)}
				placeholder={`Hydrating hair mask with saffron and shea butter for repair and shine.`}
				readOnly={isReadOnly}
				disabled={disabled}
				className={`${disabled ? '!bg-gray-200' : ''}`}
			/>
			{errors[name]?.message && (
				<span className="text-danger mt-1" style={{fontSize: '12px'}}>
					{String(errors[name]?.message)}
				</span>
			)}
		</div>
	);
}
