"use client";
import CustomModal from "../components/CustomModal";
import CustomButton from "../components/CustomButton";

interface ChooseModalProps {
	isChoose: boolean;
	setIsChoose: (open: boolean) => void;
	setIsReservationOpen: (open: boolean) => void;
}

export default function ChooseModal({ isChoose, setIsChoose, setIsReservationOpen }: ChooseModalProps) {
	return (
		<CustomModal
			variant={1}
			isOpen={isChoose}
			onClose={() => setIsChoose(false)}
			width="w-full max-w-sm sm:max-w-md md:max-w-lg"
		>
			<div className="w-full bg-white p-6 sm:p-8 flex flex-col gap-6 text-center text-gray-800">
				<h2 className="text-lg sm:text-xl font-semibold text-[#0f172a]">
					상담 방법을 선택해주세요.
				</h2>

				<div className="flex flex-col gap-3 sm:flex-row sm:justify-center">

					<CustomButton
						className="bg-yellow-300 text-black px-2 py-1 rounded-lg focus:outline-none w-full sm:w-auto"
						onClick={() => window.open("http://pf.kakao.com/_eTxkNn/chat", "_blank")}
					>
						카카오톡으로 상담하기
					</CustomButton>

					<CustomButton
						variant="prettyFull"
						width="w-full sm:w-auto"
						onClick={() => {
							setIsChoose(false);            // 이 모달 닫기
							setIsReservationOpen(true);    // 예약 모달 열기
						}}
					>
						전화로 상담하기
					</CustomButton>
				</div>
			</div>
		</CustomModal>
	);
}
