'use client';

import React from 'react';
import Select from 'react-select';
import {useFormContext, Controller} from 'react-hook-form';

interface Option {
	label: string;
	value: string | number;
}

interface PSBSelectProps {
	name: string;
	label: string;
	options: Option[];
	placeholder?: string;
	isDisabled?: boolean;
	isMulti?: boolean;
}

export default function ZMultiSelect({
	name,
	label,
	options,
	placeholder = 'Select an option',
	isDisabled = false,
	isMulti = true,
}: PSBSelectProps) {
	const {
		formState: {errors},
	} = useFormContext();

	return (
		<div className="mb-4">
			<Controller
				name={name}
				render={({field}) => {
					return (
						<Select
							{...field}
							id={name}
							options={options}
							isMulti={isMulti}
							isDisabled={isDisabled}
							placeholder={placeholder}
							className={`${isDisabled ? '!bg-gray-200' : ''} `}
							onChange={(selectedOption: any) => {
								field.onChange(selectedOption);
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
