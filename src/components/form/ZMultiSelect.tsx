'use client';

import React from 'react';
import Select from 'react-select';
import {useFormContext, Controller} from 'react-hook-form';

interface Option {
	label: string;
	value: string | number | boolean;
}

interface PSBSelectProps {
	name: string;
	label: string;
	options: Option[];
	placeholder?: string;
	isDisabled?: boolean;
	isMulti?: boolean;
	onChange?: (selectedOption: any) => void;
	style?: React.CSSProperties;
}

export default function ZMultiSelect({
	name,
	label,
	options,
	placeholder = 'Select an option',
	isDisabled = false,
	isMulti = true,
	onChange,
}: PSBSelectProps) {
	const {
		formState: {errors},
	} = useFormContext();

	return (
		<div className="mb-4 ">
			<Controller
				name={name}
				defaultValue={isMulti ? [] : null}
				render={({field}) => {
					return (
						<Select
							id={name}
							options={options}
							isMulti={isMulti}
							isDisabled={isDisabled}
							placeholder={placeholder}
							className={`${isDisabled ? '!bg-gray-200' : ''} `}
							// keep the component controlled from RHF value so `reset()` clears it
							value={field.value ?? (isMulti ? [] : null)}
							onBlur={field.onBlur}
							onChange={(selectedOption: any) => {
								field.onChange(selectedOption);
								if (onChange) {
									onChange(selectedOption);
								}
							}}
						/>
					);
				}}
			/>

			{errors[name]?.message && (
				<span className="text-danger mt-1" style={{fontSize: '12px'}}>
					{String(errors[name]?.message)}
				</span>
			)}
		</div>
	);
}
