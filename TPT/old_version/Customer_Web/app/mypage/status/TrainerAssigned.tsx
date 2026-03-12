import { useRouter } from "next/navigation";
import CancelSubscriptionModal from "../CancelSubscriptionModal";
import { useState } from "react";

export default function TrainerAssigned() {
	const router = useRouter();
	const [open, setOpen] = useState(false);

	const handleCloseModal = () => {
		setOpen(false);
		router.push("/");
	};

	return (
		<div className="w-full px-4">
			{/* 상단 영역 */}
			<div className="flex flex-col md:flex-row w-full justify-between items-start md:items-center gap-3 md:gap-0">
				<h1 className="text-xl md:text-2xl text-start text-[#B9AB70]">
					TPT를 구독해주신 고객님 환영합니다.
				</h1>

				<div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
					<button
						className="border border-[#B9AB70] text-[#B9AB70] text-sm bg-white rounded-xl px-3 py-2 cursor-pointer w-full sm:w-auto text-center"
						onClick={() => setOpen(true)}
					>
						구독 해지
					</button>
					<button
						className="text-white text-sm bg-[#B9AB70] rounded-xl px-3 py-2 cursor-pointer w-full sm:w-auto text-center"
						onClick={() => {
							router.push("/myreview");
						}}
					>
						후기 작성
					</button>
				</div>
			</div>

			{/* 안내 문구 */}
			<div className="text-sm md:text-base text-start mb-4 text-[#B9AB70] mt-2 md:mt-4">
				TPT의 트레이딩 전문가와 함께 경험을 축적하세요.
			</div>

			{/* 모달 */}
			<CancelSubscriptionModal isOpen={open} onClose={handleCloseModal} />
		</div>
	);
}
