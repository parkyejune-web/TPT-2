"use client";

import { useState } from "react";
import CustomModal from "../components/CustomModal";
import CustomButton from "../components/CustomButton";

type CancelSubscriptionModalProps = {
	isOpen: boolean;
	onClose: () => void;
};

export default function CancelSubscriptionModal({
	isOpen,
	onClose,
}: CancelSubscriptionModalProps) {
	const [isConfirmed, setIsConfirmed] = useState(false);

	return (
		<>
			{/* 첫 번째 모달: 해지 안내 */}
			<CustomModal
				variant={1}
				isOpen={isOpen && !isConfirmed}
				onClose={onClose}
				width="max-w-2xl"
			>
				<div className="flex flex-col gap-6">
					{/* 안내 문구 */}
					<h2 className="text-xl text-center text-gray-800">
						더욱 노력하는 TPT가 되겠습니다.
					</h2>

					<div className="flex justify-between items-center">
						<p className="text-sm text-gray-500 text-center">
							서비스 이용에 불편함이 있으셨다면 고객센터에서 건의하실 수 있습니다.
						</p>

						<div className="flex justify-center">
							<CustomButton variant="onlyText" textSize="text-sm">고객센터 바로가기</CustomButton>
						</div>
					</div>
					<p className="text-center text-sm text-red-600">
						구독을 해지하시는 즉시 구독자 전용 기능에 접근이 불가능해집니다.
					</p>

					{/* 혜택 설명 */}
					<div className="bg-gradient-to-r from-[#D2C693] to-[#928346] text-white p-4 rounded text-sm leading-relaxed">
						<ul className="list-disc list-inside space-y-1">
							<li>나를 위한 전문 트레이딩 트레이너 배정</li>
							<li>트레이너에게 24시간 무제한 피드백 요청 가능</li>
							<li>모든 피드백 24시간 이내 답변</li>
							<li>다른 고객의 피드백도 실시간으로 열람 가능</li>
							<li>주차별 트레이닝 강의 및 과제 공개</li>
							<li>과제 미수행 시 삼진아웃 제도</li>
							<li>내가 받은 모든 피드백을 확인하고 복습 가능</li>
						</ul>
					</div>

					{/* 버튼 영역 */}
					<div className="flex justify-between items-center mt-6">
						<CustomButton variant="prettyFull" onClick={onClose}>
							유지하기
						</CustomButton>
						<button
							onClick={() => setIsConfirmed(true)}
							className="text-red-500 cursor-pointer"
						>
							해지하기
						</button>
					</div>
				</div>
			</CustomModal>

			{/* 두 번째 모달: 해지 완료 */}
			<CustomModal
				variant={1}
				isOpen={isOpen && isConfirmed}
				onClose={onClose}
				width="max-w-md"
			>
				<div className="flex flex-col items-center gap-6">
					<p className="text-gray-800 font-medium text-center">
						정기 결제 구독이 정상적으로 해지되었습니다.
					</p>
					<CustomButton variant="prettyFull" onClick={onClose}>
						확인
					</CustomButton>
				</div>
			</CustomModal>
		</>
	);
}
