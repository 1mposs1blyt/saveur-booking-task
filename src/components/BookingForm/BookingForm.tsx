"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, getAvailableTimeSlots } from "@/utils/validation";
import { BookingFormData, BookingStatus } from "@/types/booking";

interface BookingFormProps {
	onSubmit: (data: BookingFormData) => Promise<void>;
	status: BookingStatus;
}

export default function BookingForm({ onSubmit, status }: BookingFormProps) {
	const {
		register,
		handleSubmit,
		setValue,
		control,
		formState: { errors },
	} = useForm<BookingFormData>({
		resolver: zodResolver(bookingSchema),
		mode: "onBlur",
		defaultValues: {
			name: "",
			phone: "",
			date: "",
			time: "",
			guests: 1,
		},
	});
	const isLoading = status === "loading";

	const selectedDate = useWatch({ control, name: "date" });

	const phoneValue = useWatch({ control, name: "phone" });

	const availableSlots = getAvailableTimeSlots(selectedDate || "");

	useEffect(() => {
		if (!phoneValue) return;

		let digits = phoneValue.replace(/\D/g, "");

		if (digits.startsWith("8")) {
			digits = "7" + digits.substring(1);
		}
		if (digits.length > 0 && !digits.startsWith("7")) {
			digits = "7" + digits;
		}

		digits = digits.substring(0, 11);

		let formatted = "";
		if (digits.length > 0) formatted += "+7";
		if (digits.length > 1) formatted += " (" + digits.substring(1, 4);
		if (digits.length > 4) formatted += ") " + digits.substring(4, 7);
		if (digits.length > 7) formatted += "-" + digits.substring(7, 9);
		if (digits.length > 9) formatted += "-" + digits.substring(9, 11);

		if (phoneValue !== formatted) {
			setValue("phone", formatted, { shouldValidate: true });
		}
	}, [phoneValue, setValue]);

	const todayStr = new Date().toISOString().split("T")[0];
	const maxDate = new Date();
	maxDate.setDate(maxDate.getDate() + 90);
	const maxDateStr = maxDate.toISOString().split("T")[0];

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
			<div>
				<label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
					Имя гостя
				</label>
				<input
					type="text"
					disabled={isLoading}
					placeholder="Иван Петров"
					className={`input-base ${errors.name ? "input-error" : ""}`}
					{...register("name")}
				/>
				{errors.name && (
					<p className="text-restaurant-error text-xs mt-1">{errors.name.message}</p>
				)}
			</div>
			<div>
				<label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
					Номер телефона
				</label>
				<input
					type="text"
					disabled={isLoading}
					placeholder="+7 (999) 123-45-67"
					className={`input-base ${errors.phone ? "input-error" : ""}`}
					{...register("phone")}
				/>
				{errors.phone && (
					<p className="text-restaurant-error text-xs mt-1">{errors.phone.message}</p>
				)}
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div>
					<label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
						Дата
					</label>
					<input
						type="date"
						min={todayStr}
						max={maxDateStr}
						disabled={isLoading}
						className={`input-base ${errors.date ? "input-error" : ""}`}
						{...register("date")}
					/>
					{errors.date && (
						<p className="text-restaurant-error text-xs mt-1">{errors.date.message}</p>
					)}
				</div>
				<div>
					<label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
						Время
					</label>
					<select
						disabled={isLoading || availableSlots.length === 0}
						className={`input-base bg-white ${errors.time ? "input-error" : ""}`}
						{...register("time")}
					>
						{availableSlots.length === 0 ? (
							<option value="">Нет свободных слотов</option>
						) : (
							<option value="">Выберите время</option>
						)}
						{availableSlots.map((slot) => (
							<option key={slot} value={slot}>
								{slot}
							</option>
						))}
					</select>
					{errors.time && (
						<p className="text-restaurant-error text-xs mt-1">{errors.time.message}</p>
					)}
				</div>
			</div>
			<div>
				<label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
					Количество гостей (1-12)
				</label>
				<input
					type="number"
					min={1}
					max={12}
					disabled={isLoading}
					className={`input-base ${errors.guests ? "input-error" : ""}`}
					{...register("guests", { valueAsNumber: true })}
				/>
				{errors.guests && (
					<p className="text-restaurant-error text-xs mt-1">{errors.guests.message}</p>
				)}
			</div>
			<button
				type="submit"
				disabled={isLoading}
				className="w-full mt-2 bg-restaurant-accent text-white font-medium py-3 px-4 rounded-md transition-all duration-200 hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
			>
				{isLoading ? (
					<>
						<svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
							<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
							<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
						</svg>
						<span>Бронирую...</span>
					</>
				) : (
					"Забронировать столик"
				)}
			</button>
		</form>
	);
}