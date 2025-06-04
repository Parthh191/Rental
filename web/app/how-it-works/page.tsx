"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ParticlesBackground from './ParticlesBackground';
import Image from 'next/image';

// Steps for people who want to rent products
const renterSteps = [
	{
		id: 1,
		title: 'Search',
		description:
			'Browse through our extensive collection of rental items across various categories to find exactly what you need.',
		icon: '🔍',
		imageSrc: '/images/how-it-works/search.svg',
		details: [
			'Filter by category, price, location, and availability',
			'View high-quality images and detailed descriptions',
			'Compare prices and features across multiple listings',
			'Save favorites for later reference',
		],
	},
	{
		id: 2,
		title: 'Contact',
		description:
			'Reach out to the owner through our secure messaging system to discuss details, ask questions, and schedule a pickup.',
		icon: '✉️',
		imageSrc: '/images/how-it-works/message.svg',
		details: [
			'Built-in messaging system keeps your personal info private',
			'Real-time notifications when owners respond',
			'Discuss rental terms and ask questions before committing',
			'Agree on pickup/delivery logistics',
		],
	},
	{
		id: 3,
		title: 'Visit',
		description:
			'Meet the owner at an agreed-upon location to inspect the item and ensure it meets your requirements.',
		icon: '🏠',
		imageSrc: '/images/how-it-works/location.svg',
		details: [
			'Verify the item\'s condition matches the listing description',
			'Test functionality before completing the rental',
			'Review safety features and instructions for proper use',
			'Confirm rental duration and return process',
		],
	},
	{
		id: 4,
		title: 'Rent',
		description:
			'Complete the rental agreement, make the payment through our secure platform, and enjoy your rented item!',
		icon: '📝',
		imageSrc: '/images/how-it-works/agreement.svg',
		details: [
			'Digital rental agreements protect both parties',
			'Secure payment processing with fraud protection',
			'Transparent fee structure with no hidden costs',
			'Usage instructions and support throughout the rental period',
		],
	},
];

// Steps for people who want to rent out their products
const ownerSteps = [
	{
		id: 1,
		title: 'List Item',
		description:
			'Create a detailed listing with high-quality photos, pricing, availability, and specifications of your item.',
		icon: '📸',
		imageSrc: '/images/how-it-works/camera.svg',
		details: [
			'Easy-to-use listing creation tool with photo uploading',
			'Set flexible rental periods (hourly, daily, weekly)',
			'Add detailed specifications and condition information',
			'Smart pricing suggestions based on similar items',
		],
	},
	{
		id: 2,
		title: 'Receive Inquiries',
		description:
			'Get messages from interested renters through our platform and respond to their questions.',
		icon: '📨',
		imageSrc: '/images/how-it-works/inbox.svg',
		details: [
			'All inquiries organized in one convenient dashboard',
			'Preset responses for common questions',
			'Renter profiles and verification information available',
			'Schedule management for item availability',
		],
	},
	{
		id: 3,
		title: 'Approve Rental',
		description:
			'Review rental requests and approve bookings that fit your schedule and requirements.',
		icon: '✅',
		imageSrc: '/images/how-it-works/approve.svg',
		details: [
			'Screen potential renters through verified profiles',
			'Customizable approval process to suit your preferences',
			'Automated calendar management to prevent double-booking',
			'Set clear pickup and return arrangements',
		],
	},
	{
		id: 4,
		title: 'Handover & Earn',
		description:
			'Meet the renter, hand over the item, and start earning passive income from your unused belongings!',
		icon: '💰',
		imageSrc: '/images/how-it-works/money.svg',
		details: [
			'Secure payment directly to your preferred account',
			'Protection policies against damage or theft',
			'Build your reputation through renter reviews',
			'Analytics to track your rental income and popular items',
		],
	},
];

// Benefits of using the platform
const platformBenefits = [
	{
		title: 'Eco-Friendly',
		description:
			'Reduce waste by sharing items instead of buying new ones. Help create a sustainable future.',
		icon: '🌿',
	},
	{
		title: 'Save Money',
		description:
			'Why buy expensive items you\'ll rarely use? Rent what you need at a fraction of the cost.',
		icon: '💸',
	},
	{
		title: 'Extra Income',
		description:
			'Turn your unused items into a consistent revenue stream with minimal effort.',
		icon: '💎',
	},
	{
		title: 'Community',
		description:
			'Connect with like-minded people in your area through the sharing economy.',
		icon: '👥',
	},
	{
		title: 'Insurance',
		description:
			'Our platform offers protection for both parties during the rental period.',
		icon: '🔒',
	},
	{
		title: 'Convenience',
		description:
			'Find everything you need in one place, with easy search and booking.',
		icon: '⚡',
	},
];

// Frequently Asked Questions
const faqs = [
	{
		question: 'How is payment handled?',
		answer:
			'Our secure payment system holds your payment until you confirm receipt of the item. This protects both parties and ensures a smooth transaction process.',
	},
	{
		question: 'What happens if an item is damaged?',
		answer:
			'We offer optional damage protection plans. If damage occurs, our dispute resolution team will help determine a fair solution based on our policies and the specific circumstances.',
	},
	{
		question: 'Is there a membership fee?',
		answer:
			'No, creating an account and browsing items is completely free. We only charge a small service fee when a rental transaction is completed.',
	},
	{
		question: 'How are renters and owners verified?',
		answer:
			'We use a multi-step verification process including ID verification, email confirmation, phone verification, and user reviews to build a trusted community.',
	},
	{
		question: 'Can I cancel a rental?',
		answer:
			'Yes, cancellation policies depend on the individual listing. Each owner sets their own cancellation terms, which are clearly displayed on the listing page.',
	},
];

export default function HowItWorksPage() {
	const [animateSteps, setAnimateSteps] = useState(false);
	const [activeTab, setActiveTab] = useState<'renter' | 'owner'>('renter');
	const [expandedStep, setExpandedStep] = useState<number | null>(null);
	const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

	useEffect(() => {
		// Trigger animation after component mounts
		setAnimateSteps(true);
	}, []);

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 50, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				type: 'spring',
				stiffness: 100,
				damping: 15,
			},
		},
		hover: {
			scale: 1.03,
			boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.15)',
			transition: { type: 'spring', stiffness: 300, damping: 10 },
		},
	};

	const benefitVariants = {
		hidden: { scale: 0.8, opacity: 0 },
		visible: {
			scale: 1,
			opacity: 1,
			transition: { type: 'spring', stiffness: 100 },
		},
		hover: {
			scale: 1.05,
			transition: { type: 'spring', stiffness: 300, damping: 10 },
		},
	};

	const fadeInUpVariants = {
		hidden: { y: 30, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: { duration: 0.6 },
		},
	};

	const pulseAnimation = {
		scale: [1, 1.03, 1],
		transition: { duration: 2, repeat: Infinity },
	};

	const toggleStep = (id: number) => {
		if (expandedStep === id) {
			setExpandedStep(null);
		} else {
			setExpandedStep(id);
		}
	};

	const toggleFaq = (id: number) => {
		if (expandedFaq === id) {
			setExpandedFaq(null);
		} else {
			setExpandedFaq(id);
		}
	};

	const currentSteps = activeTab === 'renter' ? renterSteps : ownerSteps;

	return (
		<div className="relative min-h-screen bg-[#121212] overflow-hidden">
			{/* Custom particle background */}
			<ParticlesBackground />

			{/* Hero section */}
			<div className="relative z-10 overflow-hidden">
				<div className="container mx-auto px-4 py-20 md:py-32">
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="text-center mb-16"
					>
						<h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight">
							<span className="inline-block bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
								How It Works
							</span>
						</h1>
						<motion.p
							className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
							animate={pulseAnimation}
						>
							Our platform connects people who have items to rent with those who need
							them.
						</motion.p>
					</motion.div>

					{/* Tab Selector */}
					<motion.div
						className="flex justify-center mb-20"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.3 }}
					>
						<div className="bg-[#1E1E1E] p-1.5 rounded-full flex shadow-lg shadow-purple-900/20">
							<button
								onClick={() => setActiveTab('renter')}
								className={`px-8 py-4 rounded-full transition-all duration-500 text-lg font-medium ${
									activeTab === 'renter'
										? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
										: 'text-gray-400 hover:text-white'
								}`}
							>
								I Want To Rent Something
							</button>
							<button
								onClick={() => setActiveTab('owner')}
								className={`px-8 py-4 rounded-full transition-all duration-500 text-lg font-medium ${
									activeTab === 'owner'
										? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg'
										: 'text-gray-400 hover:text-white'
								}`}
							>
								I Have Items To Rent Out
							</button>
						</div>
					</motion.div>
				</div>
			</div>

			{/* Process Steps Section */}
			<div className="relative z-10 py-16 bg-black bg-opacity-40">
				<div className="container mx-auto px-4">
					<motion.h2
						className="text-3xl md:text-4xl font-bold text-center mb-16 text-white"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.8 }}
					>
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
							{activeTab === 'renter'
								? 'Rent in 4 Simple Steps'
								: 'Start Earning in 4 Simple Steps'}
						</span>
					</motion.h2>

					{/* Animated steps */}
					<motion.div
						variants={containerVariants}
						initial="hidden"
						animate={animateSteps ? 'visible' : 'hidden'}
						className="grid grid-cols-1 lg:grid-cols-4 gap-10"
					>
						{currentSteps.map((step, index) => (
							<motion.div
								key={step.id}
								variants={itemVariants}
								whileHover="hover"
								className="bg-gradient-to-br from-gray-900 to-[#151515] p-6 rounded-2xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300 group relative overflow-hidden"
								onClick={() => toggleStep(step.id)}
							>
								{/* Step number backdrop */}
								<div className="absolute -right-6 -bottom-6 text-[120px] font-bold text-gray-800 opacity-10 select-none">
									{step.id}
								</div>

								<div className="relative z-10">
									{/* Icon */}
									<motion.div
										className={`w-16 h-16 rounded-2xl ${
											activeTab === 'renter'
												? 'bg-gradient-to-br from-purple-500 to-pink-600'
												: 'bg-gradient-to-br from-teal-500 to-blue-600'
										} flex items-center justify-center text-2xl mb-6`}
										whileHover={{
											rotate: [0, -10, 10, -10, 0],
											transition: { duration: 0.5 },
										}}
									>
										{step.icon}
									</motion.div>

									{/* Title with animated underline */}
									<div className="relative mb-4">
										<h3 className="text-2xl font-bold text-white inline-block">
											{step.title}
										</h3>
										<motion.div
											className={`h-1 rounded-full mt-2 ${
												activeTab === 'renter' ? 'bg-pink-600' : 'bg-teal-500'
											}`}
											initial={{ width: 0 }}
											whileInView={{ width: '40%' }}
											viewport={{ once: true }}
											transition={{ delay: 0.3, duration: 0.4 }}
										/>
									</div>

									{/* Description */}
									<p className="text-gray-400 mb-6">{step.description}</p>

									{/* Expandable details */}
									<motion.div
										animate={{ height: expandedStep === step.id ? 'auto' : 0 }}
										initial={{ height: 0 }}
										className="overflow-hidden"
										transition={{ duration: 0.4, ease: 'easeInOut' }}
									>
										<ul className="space-y-2 mb-6">
											{step.details.map((detail, i) => (
												<motion.li
													key={i}
													initial={{ opacity: 0, x: -20 }}
													animate={{
														opacity: expandedStep === step.id ? 1 : 0,
														x: expandedStep === step.id ? 0 : -20,
													}}
													transition={{ delay: i * 0.1, duration: 0.3 }}
													className="flex items-start text-gray-300"
												>
													<span
														className={`mr-2 text-sm ${
															activeTab === 'renter'
																? 'text-pink-400'
																: 'text-teal-400'
														}`}
													>
														•
													</span>
													{detail}
												</motion.li>
											))}
										</ul>
									</motion.div>

									{/* Read more button */}
									<button
										className={`text-sm font-medium ${
											activeTab === 'renter'
												? 'text-pink-400 hover:text-pink-300'
												: 'text-teal-400 hover:text-teal-300'
										} flex items-center transition-colors`}
										onClick={() => toggleStep(step.id)}
									>
										{expandedStep === step.id ? 'Show Less' : 'Learn More'}
										<motion.svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4 ml-1"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											animate={{
												rotate: expandedStep === step.id ? 180 : 0,
											}}
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M19 9l-7 7-7-7"
											/>
										</motion.svg>
									</button>
								</div>
							</motion.div>
						))}
					</motion.div>
				</div>
			</div>

			{/* Benefits Section */}
			<div className="relative z-10 py-24">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.8 }}
						className="text-center mb-16"
					>
						<h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
							<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
								Why Choose Our Platform
							</span>
						</h2>
						<p className="text-xl text-gray-300 max-w-2xl mx-auto">
							Enjoy these benefits and more when you join our rental community
						</p>
					</motion.div>

					<motion.div
						variants={containerVariants}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
					>
						{platformBenefits.map((benefit, index) => (
							<motion.div
								key={index}
								variants={benefitVariants}
								whileHover="hover"
								className="bg-[#1E1E1E] p-6 rounded-xl border border-gray-800 transition-all duration-300"
							>
								<div className="mb-4 text-4xl">{benefit.icon}</div>
								<h3 className="text-xl font-bold mb-2 text-white">
									{benefit.title}
								</h3>
								<p className="text-gray-400">{benefit.description}</p>
							</motion.div>
						))}
					</motion.div>
				</div>
			</div>

			{/* FAQ Section */}
			<div className="relative z-10 py-20 bg-black bg-opacity-40">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="text-center mb-16"
					>
						<h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
							<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
								Frequently Asked Questions
							</span>
						</h2>
					</motion.div>

					<div className="max-w-3xl mx-auto">
						{faqs.map((faq, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1, duration: 0.5 }}
								className="mb-4"
							>
								<div
									className="bg-[#1E1E1E] p-5 rounded-lg border border-gray-800 hover:border-purple-500/50 transition-all duration-200 cursor-pointer"
									onClick={() => toggleFaq(index)}
								>
									<div className="flex justify-between items-center">
										<h3 className="text-lg font-medium text-white">
											{faq.question}
										</h3>
										<motion.div
											animate={{ rotate: expandedFaq === index ? 180 : 0 }}
											transition={{ duration: 0.3 }}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5 text-purple-400"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
													clipRule="evenodd"
												/>
											</svg>
										</motion.div>
									</div>

									<motion.div
										initial={{ height: 0 }}
										animate={{ height: expandedFaq === index ? 'auto' : 0 }}
										className="overflow-hidden"
										transition={{ duration: 0.3 }}
									>
										<p className="text-gray-400 mt-4">{faq.answer}</p>
									</motion.div>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</div>

			{/* CTA Section */}
			<div className="relative z-10 py-24">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="max-w-4xl mx-auto bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] p-10 rounded-2xl border border-gray-800 text-center shadow-xl shadow-purple-900/10"
					>
						<motion.h2
							className="text-3xl md:text-4xl font-bold mb-6 text-white"
							animate={{
								textShadow: [
									'0 0 8px rgba(168, 85, 247, 0.5)',
									'0 0 16px rgba(168, 85, 247, 0.3)',
									'0 0 8px rgba(168, 85, 247, 0.5)',
								],
							}}
							transition={{ duration: 2, repeat: Infinity }}
						>
							Ready to{' '}
							{activeTab === 'renter' ? 'Start Renting' : 'List Your Items'}?
						</motion.h2>

						<p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
							Join thousands of satisfied users who are{' '}
							{activeTab === 'renter'
								? 'renting what they need'
								: 'earning from their unused items'}{' '}
							through our platform.
						</p>

						<div className="flex flex-col sm:flex-row justify-center gap-4">
							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="inline-block relative group"
							>
								<div
									className={`absolute -inset-1 ${
										activeTab === 'renter'
											? 'bg-gradient-to-r from-purple-600 to-pink-600'
											: 'bg-gradient-to-r from-teal-600 to-blue-600'
									} rounded-lg blur opacity-40 group-hover:opacity-100 transition duration-500`}
								></div>
								<button className="relative px-8 py-4 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600 text-lg">
									<span className="pr-6 text-gray-100 group-hover:text-white transition duration-200">
										{activeTab === 'renter'
											? 'Browse Items'
											: 'Create Listing'}
									</span>
									<span
										className={`pl-6 ${
											activeTab === 'renter'
												? 'text-purple-400'
												: 'text-teal-400'
										} group-hover:text-white transition duration-200`}
									>
										→
									</span>
								</button>
							</motion.div>

							<motion.div
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<button className="px-8 py-4 bg-transparent border border-gray-700 hover:border-white rounded-lg text-white text-lg transition-colors duration-300">
									Learn More
								</button>
							</motion.div>
						</div>
					</motion.div>
				</div>
			</div>

			{/* Statistics Section */}
			<div className="relative z-10 py-16 bg-black bg-opacity-60">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
						{[
							{ value: '10,000+', label: 'Active Users' },
							{ value: '5,000+', label: 'Items Listed' },
							{ value: '$250K+', label: 'Money Saved' },
							{ value: '95%', label: 'Satisfaction' },
						].map((stat, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.1, duration: 0.5 }}
								className="text-center"
							>
								<motion.p
									className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2"
									animate={{ scale: [1, 1.05, 1] }}
									transition={{
										duration: 2,
										repeat: Infinity,
										repeatDelay: index,
									}}
								>
									{stat.value}
								</motion.p>
								<p className="text-gray-400">{stat.label}</p>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}