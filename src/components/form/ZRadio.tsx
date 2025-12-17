'use client';

import React from 'react';
import {useFormContext} from 'react-hook-form';

interface ZRadioOption {
	label: string;
	value: string;
}

interface ZRadioProps {
	name: string;
	options: ZRadioOption[];
	disabled?: boolean;
	onChange?: (value: string) => void;
}

export default function ZRadio({name, options, disabled = false, onChange}: ZRadioProps) {
	const {
		register,
		formState: {errors},
		watch,
	} = useFormContext();

	const value = watch(name);

	// Check if value is undefined (form not initialized yet)
	const isValueUndefined = value === undefined;

	// Only default to "true" when form value is undefined AND "true" exists in options
	const shouldDefaultToTrue = isValueUndefined && options.some((opt) => opt.value === 'true');

	return (
		<div className="mb-4">
			<div className="d-flex gap-4">
				{options.map((option) => (
					<label key={option.value} className="d-flex align-items-center gap-2 cursor-pointer">
						<input
							type="radio"
							value={option.value}
							id={name}
							disabled={disabled}
							// Only use defaultChecked when value is undefined and this is "true" option
							defaultChecked={shouldDefaultToTrue && option.value === 'true'}
							{...register(name)}
							onChange={() => onChange?.(option.value)}
						/>
						<span>{option.label}</span>
					</label>
				))}
			</div>

			{errors[name]?.message && (
				<span className="text-danger mt-1 d-block" style={{fontSize: '12px'}}>
					{String(errors[name]?.message)}
				</span>
			)}
		</div>
	);
}
