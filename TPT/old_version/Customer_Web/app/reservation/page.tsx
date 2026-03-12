"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import CustomModal from "../components/CustomModal";
import CustomDivider from "../components/CustomDivider";

type TimeSlot = {
	time: string;
	available: boolean;
};

export default function Reservation() {
	const router = useRouter();

	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [selectedTime, setSelectedTime] = useState<string | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

	const closeModal = () => {
		setIsModalOpen(false);
	};

	const back = () => {
		setIsModalOpen(false);
		router.push("/");
	}

	// mockData (추후 API 대체 예정)
	const mockTimes: TimeSlot[] = [
		{ time: "09:00", available: true },
		{ time: "10:00", available: true },
		{ time: "11:00", available: true },
		{ time: "13:00", available: true },
		{ time: "14:00", available: false }, // 예약 불가
		{ time: "15:00", available: true },
		{ time: "16:00", available: true },
		{ time: "17:00", available: true },
		{ time: "18:00", available: true },
	];

	useEffect(() => {
		// fetch("/api/times?date=...")
		setTimeSlots(mockTimes);
	}, []);

	const handleReserve = () => {
		if (selectedDate && selectedTime) {
			setIsModalOpen(true);
		}
	};

	const formatDate = (date: Date) => {
		return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
	};

	return (
		<div className="flex flex-col max-w-2xl mx-auto p-6 gap-20">
			<div className="flex flex-col w-full gap-5">
				<div className="flex gap-3 w-full items-center justify-center">
					<Image
						src="/images/logo_main.png"
						alt="logo"
						width={30}
						height={30}
						className="object-contain"
					/>
					<h3 className="text-2xl font-bold">상담 예약</h3>
				</div>
				<CustomDivider />
				{/* 날짜 선택 */}
				<h2 className="text-2xl mt-10 mb-2">1. 상담 날짜를 선택해주세요.</h2>
				<div className="flex flex-col items-start gap-6 mb-6">
					<div>
						<Calendar
							onChange={(date) => {
								setSelectedDate(date as Date);
								setSelectedTime(null); // 날짜 바꾸면 시간 초기화
							}}
							value={selectedDate}
							minDate={new Date()}
							className="rounded-md"
						/>
					</div>
					<div>
						<p className="text-sm text-gray-600">선택하신 날짜:</p>
						<p className="text-2xl">
							{selectedDate ? formatDate(selectedDate) : "날짜를 선택해주세요."}
						</p>
					</div>
				</div>
			</div>

			<div className="flex flex-col w-full gap-3">
				{/* 시간 선택 */}
				<h2 className="text-2xl mb-2">2. 상담 시간을 선택해주세요.</h2>
				<p className="text-sm text-gray-500 mb-4">
					상담은 유선으로 진행되며, 약 1시간 소요됩니다.
				</p>

				<div className="grid grid-cols-3 gap-3 mb-8">
					{timeSlots.map(({ time, available }) => (
						<button
							key={time}
							disabled={!available}
							onClick={() => setSelectedTime(time)}
							className={`rounded-md border-[0.5px] px-4 py-2 text-sm font-medium 
              ${!available
									? "text-gray-400 bg-gray-50 cursor-not-allowed"
									: selectedTime === time
										? "bg-indigo-100 border-indigo-400 border-[0.5px] text-indigo-600 cursor-pointer"
										: "hover:bg-gray-50 border-[0.5px] cursor-pointer"
								}`}
						>
							{time < "12:00" ? `오전 ${time}` : `오후 ${time}`}
						</button>
					))}
				</div>
			</div>

			{/* 선택한 일시 안내 */}
			{selectedDate && selectedTime && (
				<div className="border-t pt-4 mb-6">
					<p className="mb-2">
						선택하신 상담 일시는{" "}
						<span className="font-semibold">
							{formatDate(selectedDate)}{" "}
							{selectedTime < "12:00" ? "오전" : "오후"} {selectedTime}
						</span>{" "}
						입니다.
					</p>
					<p className="text-sm text-gray-500">
						트레이너가 상담 일시에 맞추어 전화를 드릴 예정입니다.
					</p>
				</div>
			)}

			{/* 상담 신청 버튼 */}
			<button
				onClick={handleReserve}
				disabled={!selectedDate || !selectedTime}
				className={`w-full rounded-md py-3 ${selectedDate && selectedTime
					? "bg-indigo-200 cursor-pointer text-[#2626C3]"
					: "bg-gray-200 cursor-not-allowed text-gray-500"
					}`}
			>
				상담 신청하기
			</button>


			<CustomModal variant={1} isOpen={isModalOpen} onClose={closeModal} width="auto">
				<div className="bg-white p-6 w-full text-center">
					<p className="font-semibold text-lg mb-4">
						전화 상담 신청이 완료되었습니다.
					</p>
					<p className="text-sm text-gray-600 mb-4">
						선택하신 일시에 고객님의 연락처로 전화를 드릴 예정입니다.
						<br />
						<br />
						일정 변동이 있으신 경우
						<br />
						마이페이지에서 상담 일시를 변경하실 수 있습니다.
					</p>
					<button
						onClick={back}
						className="mt-4 px-4 py-2 rounded-md bg-indigo-200 cursor-pointer hover:bg-indigo-300"
					>
						확인
					</button>
				</div>
			</CustomModal>

		</div>
	);
}
