'use client';

import React, {useState} from 'react';
import ZForm from '@/components/form/ZForm';
import ZInput from '@/components/form/ZInput';
import {FieldValues} from 'react-hook-form';
import {toast} from 'react-toastify';

import {useAppSelector} from '@/redux/hooks';
import {selectUser} from '@/redux/features/user/userSlice';
import {useGetMyProfileQuery, useUpdateMyProfileMutation} from '@/redux/features/user/userApi';
import comparePassword from '@/utils/comparePassword';
import hashPassword from '@/utils/hashPassword';
const AddProductPage = () => {
	const user = useAppSelector(selectUser);

	const {data: myProfile} = useGetMyProfileQuery(user?.id!);
	const [updateProfile, {isLoading}] = useUpdateMyProfileMutation();
	const [showPassword, setShowPassword] = useState(false);
	const handleSubmit = async (data: FieldValues) => {
		const new_password = data.newPassword;
		if (new_password.length < 6) {
			return toast.error('New password must be at least 6 characters long');
		}
		const isPasswordValid = await comparePassword(data.currentPassword, myProfile.password_hash);
		if (!isPasswordValid) {
			return toast.error('Current password is incorrect');
		}

		const newHashPassword = await hashPassword(new_password);
		const newData = {
			name: myProfile.name,
			email: myProfile.email,
			password_hash: newHashPassword,
		};
		try {
			const result = await updateProfile({
				id: myProfile.id,
				data: newData,
			}).unwrap();
		} catch (error) {
			toast.error('Failed to update profile');
		}
	};
	const handleRadioClick = () => {
		// manually toggle since radio doesn’t uncheck itself
		setShowPassword((prev) => !prev);
	};
	return (
		<div className="body-root-inner">
			<div className="transection">
				<div className="vendor-list-main-wrapper product-wrapper add-product-page">
					<div className="card-body table-product-select">
						<div className="header-two show right-collups-add-product">
							<div className="right-collups-area-top">
								<h6 className="title" style={{fontSize: '32px'}}>
									Change Password
								</h6>
							</div>

							<div className="input-main-wrapper">
								<ZForm onSubmit={handleSubmit}>
									<div className="single-input">
										<label htmlFor="currentPassword">Current Password</label>
										<ZInput
											name="currentPassword"
											label="Current Password"
											type={showPassword ? 'text' : 'password'}
										/>
									</div>

									<div className="single-input">
										<label htmlFor="newPassword">New Password</label>
										<ZInput
											name="newPassword"
											label="New Password"
											type={showPassword ? 'text' : 'password'}
										/>
									</div>

									{/* Radio Button for Show/Hide Password */}
									<div className="password-visibility">
										<label className="flex items-center gap-2 mb-4 text-gray-700 cursor-pointer">
											<input
												type="radio"
												name="passwordToggle"
												checked={showPassword}
												onClick={handleRadioClick} // toggle on click
												readOnly
											/>
											<span style={{fontSize: '14px'}}> Show Password</span>
										</label>
									</div>

									<div className="button-area-botton-wrapper-p-list">
										<button type="submit" className="rts-btn btn-primary" disabled={isLoading}>
											{isLoading ? 'Saving...' : 'Save Changes'}
										</button>
									</div>
								</ZForm>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddProductPage;
