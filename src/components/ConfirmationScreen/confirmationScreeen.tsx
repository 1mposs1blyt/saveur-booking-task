"use client";

import { BookingFormData } from "@/types/booking";

interface ConfirmationScreenProps {
	data: BookingFormData;
	onReset: () => void;
}

export default function ConfirmationScreen({ data, onReset }: ConfirmationScreenProps) {
	const formatDate = (dateStr: string) => {
		try {
			const date = new Date(dateStr);
			return date.toLocaleDateString("ru-RU", {
				day: "numeric",
				month: "long",
				year: "numeric",
			});
		} catch {
			return dateStr;
		}
	};

	const getGuestsLabel = (count: number) => {
		const lastDigit = count % 10;
		const lastTwoDigits = count % 100;

		if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return `${count} гостей`;
		if (lastDigit === 1) return `${count} гость`;
		if (lastDigit >= 2 && lastDigit <= 4) return `${count} гостя`;
		return `${count} гостей`;
	};

	return (
		<div className="text-center py-4 space-y-6">
			<div className="flex justify-center">
				<div className="w-16 h-16 bg-restaurant-accent/10 rounded-full flex items-center justify-center text-restaurant-accent">
					<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
						<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
					</svg>
				</div>
			</div>

			<div className="space-y-2">
				<h2 className="text-xl font-medium text-restaurant-text">
					Ждем вас в гости, {data.name}!
				</h2>
				<p className="text-sm text-gray-500">
					Столик успешно зарезервирован. На ваш номер телефона будет отправлено SMS-подтверждение.
				</p>
			</div>

			<div className="bg-restaurant-bg/60 border border-gray-100 rounded-lg p-4 text-left space-y-3">
				<div className="flex justify-between items-center pb-2 border-b border-gray-200/60 text-sm">
					<span className="text-gray-500">Дата</span>
					<span className="font-medium text-restaurant-text">{formatDate(data.date)}</span>
				</div>

				<div className="flex justify-between items-center pb-2 border-b border-gray-200/60 text-sm">
					<span className="text-gray-500">Время</span>
					<span className="font-medium text-restaurant-text">{data.time}</span>
				</div>

				<div className="flex justify-between items-center pb-2 border-b border-gray-200/60 text-sm">
					<span className="text-gray-500">Компания</span>
					<span className="font-medium text-restaurant-text">{getGuestsLabel(data.guests)}</span>
				</div>

				<div className="flex justify-between items-center text-sm">
					<span className="text-gray-500">Телефон</span>
					<span className="font-medium text-restaurant-text">
						{data.phone.replace(/(\d)(\d{3})(\d{3})(\d{2})(\d{2})/, "+$1 ($2) $3-$4-$5")}
					</span>
				</div>
			</div>

			<button
				onClick={onReset}
				className="w-full border border-restaurant-accent text-restaurant-accent font-medium py-3 px-4 rounded-md transition-colors duration-200 hover:bg-restaurant-accent hover:text-white"
			>
				Забронировать еще
			</button>
		</div>
	);
}