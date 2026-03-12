"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Reservation from "./BookModal";
import CustomModal from "../components/CustomModal";
import ChooseModal from "./ChooseModal";

const MainToast = () => {
	const router = useRouter();
	const [isReservationOpen, setIsReservationOpen] = useState(false);
	const [isChoose, setIsChoose] = useState(false);

	return (
		<div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-4xl bg-[#272727] text-white px-4 py-3 md:px-6 md:py-4 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
			{/* 텍스트 */}
			<span className="text-sm sm:text-base md:text-lg font-semibold text-center md:text-left whitespace-normal">
				“내 주식, 이대로 괜찮을까?” 지금 바로 TPT에게 상담하세요!
			</span>

			{/* 버튼 */}
			<button
				onClick={() => setIsChoose(true)}
				className="bg-[#EF5555] text-white font-semibold px-4 py-2 md:px-6 md:py-2 rounded-md cursor-pointer w-full md:w-auto"
			>
				상담 신청
			</button>

			{/* 상담 방법 선택 모달 */}
			<ChooseModal
				isChoose={isChoose}
				setIsChoose={setIsChoose}
				setIsReservationOpen={setIsReservationOpen}
			/>

			{/* 예약 모달 */}
			<CustomModal
				variant={0}
				isOpen={isReservationOpen}
				onClose={() => setIsReservationOpen(false)}
				width="max-w-3xl"
			>
				<Reservation onClose={() => setIsReservationOpen(false)} />
			</CustomModal>
		</div>
	);
};

export default MainToast;
