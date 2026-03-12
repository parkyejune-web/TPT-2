"use client";

export default function FeedbackHeader() {

	return (
		<div className="flex items-center gap-4 border-b pb-4 mb-6">
			{/* 구독자 전용 배지 */}
			<div className="flex items-center gap-2 bg-gradient-to-r from-[#D2C693] to-[#928346] text-white px-4 py-2 rounded-md text-sm">
				구독자 전용
			</div>

			{/* 안내 문구 */}
			<h2 className="text-xl text-[#B9AB70]">
				담당 트레이너에게 피드백을 요청합니다.
			</h2>
		</div>
	);
}
