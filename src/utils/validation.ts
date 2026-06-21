import { z } from "zod";

export const formatPhone = (phone: string): string => {
	const cleaned = phone.replace(/(?!^\+)\D/g, '');
	if (!cleaned) return '';
	const onlyDigits = cleaned.replace(/\D/g, '');
	if (onlyDigits.length === 11) {
		if (onlyDigits[0] === '7') {
			return `+7${onlyDigits.slice(1)}`;
		}
		if (onlyDigits[0] === '8') {
			return onlyDigits;
		}
	}
	return cleaned;
};

export const TIME_SLOTS = [
	"12:00", "13:00", "14:00", "15:00", "16:00",
	"17:00", "18:00", "19:00", "20:00", "21:00", "22:00"
];

export const getAvailableTimeSlots = (selectedDateStr: string): string[] => {
	if (!selectedDateStr) return TIME_SLOTS;
	const now = new Date();
	const todayStr = now.toISOString().split("T")[0];
	if (selectedDateStr !== todayStr) return TIME_SLOTS;
	const currentHours = now.getHours();
	const currentMinutes = now.getMinutes();
	return TIME_SLOTS.filter(slot => {
		const [slotHours, slotMinutes] = slot.split(":").map(Number);
		if (slotHours > currentHours) return true;
		if (slotHours === currentHours && slotMinutes > currentMinutes + 30) return true;
		return false;
	});
};
export const bookingSchema = z.object({
	name: z
		.string()
		.min(1, "Имя обязательно для заполнения")
		.min(2, "Имя должно содержать минимум 2 символа")
		.regex(/^[a-zA-Zа-яА-ЯёЁ\s-]+$/, "Имя может содержать только буквы, пробелы и дефис"),
	phone: z
		.string()
		.min(1, "Телефон обязателен для заполнения")
		.refine((val) => {
			const digits = formatPhone(val);
			return digits !== null;
		}, "Введите корректный номер: +7 или 8, 10 цифр"),
	date: z
		.string()
		.min(1, "Дата обязательна")
		.refine((dateStr) => {
			const [year, month, day] = dateStr.split("-").map(Number);
			const selectedDate = new Date(year, month - 1, day);
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			return selectedDate >= today;
		}, "Дата не может быть в прошлом")
		.refine((dateStr) => {
			const [year, month, day] = dateStr.split("-").map(Number);
			const selectedDate = new Date(year, month - 1, day);
			const maxDate = new Date();
			maxDate.setHours(0, 0, 0, 0);
			maxDate.setDate(maxDate.getDate() + 90);

			return selectedDate <= maxDate;
		}, "Бронирование возможно максимум на 90 дней вперед"),
	time: z
		.string()
		.min(1, "Время обязательно")
		.refine((timeVal) => {
			const validSlots = [
				"12:00", "13:00", "14:00", "15:00", "16:00",
				"17:00", "18:00", "19:00", "20:00", "21:00", "22:00"
			];
			return validSlots.includes(timeVal);
		}, "Выберите корректный временной слот"),
	guests: z
		.number({
			message: "Укажите количество гостей",
		})
		.int("Количество гостей должно быть целым числом")
		.min(1, "Минимум 1 гость")
		.max(12, "Максимум 12 гостей")
});