'use client';
import ShortService from '@/components/service/ShortService';
import HeaderFive from '@/components/header/HeaderFive';
import FooterThree from '@/components/footer/FooterThree';
import ZForm from '@/components/form/ZForm';
import ZInput from '@/components/form/ZInput';
import ZTextArea from '@/components/form/ZTextArea';
import {zodResolver} from '@hookform/resolvers/zod';
import {messageSchema, messageSchemaBangla} from '@/schemas/message.schema';
import {FieldValues} from 'react-hook-form';
import {useCreateMessageMutation} from '@/redux/features/message/messageApi';
import {useGetAllCompanyContactsQuery} from '@/redux/features/companyContact/companyContact';
import {ICompanyContact} from '@/types/companyContact.types';
import Skeleton from 'react-loading-skeleton';
import {useAppSelector} from '@/redux/hooks';
import {selectLanguage} from '@/redux/features/language/languageSlice';
import FAQ from '@/components/FAQ/FAQ';
import BottomNav from '@/components/BottomNav/BottomNav';
import BottomCategory from '@/components/bottom-category/BottomCategory';
import DeskCategory from '@/components/bottom-category/DeskCategory';

export default function Home() {
	const {data, isLoading: contactInfoLoading} = useGetAllCompanyContactsQuery('');
	const language = useAppSelector(selectLanguage);
	const [createMessage, {isLoading}] = useCreateMessageMutation();
	const handleSubmit = async (data: FieldValues) => {
		await createMessage(data);
	};
	return (
		<div className="demo-one">
			<HeaderFive />
			<BottomCategory />
			<DeskCategory />
			<>
				{/* rts contact main wrapper */}
				<div className="rts-contact-main-wrapper-banner bg_image">
					<div className="container">
						<div className="row">
							<div className="col-lg-12">
								<div className="contact-banner-content">
									<h1 className="title">
										{language === 'en' ? 'Ask Us Question' : 'আমাদের প্রশ্ন করুন'}
									</h1>
									{/* <p className="disc">  
										Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque pretium mollis
										ex, vel interdum augue faucibus sit amet. Proin tempor purus ac suscipit...
									</p> */}
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* rts contact main wrapper end */}

				<div className="rts-map-contact-area rts-section-gap2">
					<div className="container">
						<div className="row">
							<div className="col-lg-4">
								<div className="contact-left-area-main-wrapper">
									<h2 className="title">
										{language === 'en'
											? 'You can ask us questions !'
											: 'আপনি আমাদের কাছে প্রশ্ন করতে পারেন!'}
									</h2>
									<p className="disc">
										{language === 'en'
											? 'Feel free to reach out to us with any questions or inquiries you may have. Our team is here to assist you and provide the information you need.'
											: 'আপনার যেকোনো প্রশ্ন বা অনুসন্ধানের জন্য আমাদের সাথে যোগাযোগ করতে বিনা দ্বিধায়। আমাদের দল আপনাকে সহায়তা করতে এবং আপনার প্রয়োজনীয় তথ্য সরবরাহ করতে এখানে রয়েছে।'}
									</p>
									{contactInfoLoading ? (
										<>
											<Skeleton
												className=" w-full h-40 rounded-md d-block mb-3"
												style={{height: '150px', width: '100%', backgroundColor: '#f3f4f6'}}
											/>
											<Skeleton
												className="w-full h-40 rounded-md  d-block mb-3"
												style={{height: '150px', width: '100%', backgroundColor: '#f3f4f6'}}
											/>
										</>
									) : data && data.length > 0 ? (
										<>
											{data.slice(0, 1).map((contact: ICompanyContact) => (
												<div key={contact.id} className="location-single-card">
													<div className="icon">
														<i className="fa-light fa-location-dot" />
													</div>
													<div className="information">
														<h3 className="title">
															{language === 'en' ? contact.company_name : contact.b_company_name}{' '}
														</h3>
														<p>{language === 'en' ? contact.address : contact.b_address}</p>
														<a href={`tel:${contact.phone}`} className="number">
															{language === 'en' ? contact.phone : contact.b_phone || '01905050505'}
														</a>
														<a href={`mailto:${contact.email}`} className="email">
															{contact.email}
														</a>
													</div>
												</div>
											))}
										</>
									) : (
										<p>No contact information available.</p>
									)}
								</div>
							</div>
							<div className="col-lg-8 pl--50 pl_sm--5 pl_md--5">
								<iframe
									src={
										data && data.length > 0
											? data[0].map
											: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.9026062638853!2d90.3917186750662!3d23.750903394616736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b0876f5f6b%3A0x8fae6b3f4e4c5b6!2sTaraaz%20Limited!5e0!3m2!1sen!2sbd!4v1696224567890!5m2!1sen!2sbd'
									}
									width={600}
									height={540}
									style={{border: 0}}
									allowFullScreen={true} // Fixed here: Set to true or omitted if not needed
									loading="lazy"
									referrerPolicy="no-referrer-when-downgrade"
								/>
							</div>
						</div>
					</div>
				</div>
				{/* rts contact-form area start */}
				<div className="rts-contact-form-area rts-section-gapBottom">
					<div className="container">
						<div className="row">
							<div className="col-lg-12">
								<div className="bg_light-1 contact-form-wrapper-bg">
									<div className="row">
										<div className="col-lg-7 pr--30 pr_md--10 pr_sm--5">
											<div className="contact-form-wrapper-1">
												<h3 className="title mb--50">
													{language === 'en'
														? 'Fill Up The Form If You Have Any Question'
														: 'যদি আপনার কোন প্রশ্ন থাকে তবে ফর্মটি পূরণ করুন'}
												</h3>
												<div className="contact-form-1">
													<ZForm
														onSubmit={handleSubmit}
														resolver={zodResolver(
															language === 'en' ? messageSchema : messageSchemaBangla,
														)}
													>
														<div className="contact-form-wrapper--half-area">
															<div className="single">
																<ZInput
																	name="name"
																	label={language === 'en' ? 'Name' : 'নাম'}
																	type="text"
																/>
															</div>
															<div className="single">
																<ZInput
																	name="email"
																	label={language === 'en' ? 'Email' : 'ইমেইল'}
																	type="email"
																/>
															</div>
														</div>
														<div className="single-select">
															<ZInput
																name="subject"
																label={language === 'en' ? 'Subject' : 'বিষয়'}
																type="text"
															/>
														</div>
														<ZTextArea name="message" />
														<button type="submit" className="rts-btn btn-primary mt--20">
															{isLoading
																? language === 'en'
																	? 'Sending...'
																	: 'পাঠানো হচ্ছে...'
																: language === 'en'
																? 'Send Message'
																: 'বার্তা পাঠান'}
														</button>
													</ZForm>
												</div>
											</div>
										</div>
										<div className="col-lg-5 mt_md--30 mt_sm--30">
											<div className="thumbnail-area">
												<img src="assets/images/contact/contact.jpg" alt="contact_form" />
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* rts contact-form area end */}
			</>
			{/* <div className="container">
				<h2>{language === 'en' ? 'Frequently Asked Questions' : 'সাধারণ জিজ্ঞাসা'}</h2>
				<FAQ />
			</div> */}
			<BottomNav />
			<ShortService />
			<FooterThree />
		</div>
	);
}
