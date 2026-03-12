// components/mypage/status/PaidAfterTestTrainerAssigning.tsx
export default function PaidAfterTestTrainerAssigning() {
	return (
		<div>
			<div className="flex w-full justify-between">
				<h1 className="text-2xl text-start mb-2 text-[#B9AB70]">TPT를 구독해주신 고객님 환영합니다.</h1>
				<div className="flex w-auto gap-2">
					<button className="border border-[#B9AB70] text-[#B9AB70] text-sm bg-white rounded-xl px-2 py-1">구독 해지</button>
					<button className="text-white text-sm bg-[#B9AB70] rounded-xl px-2 py-1">후기 작성</button>
				</div>
			</div>
			<div className="text-sm text-start mb-4 text-[#B9AB70]">
				TPT의 트레이딩 전문가와 함께 경험을 축적하세요.
			</div>

			<div className="flex bg-[#0F182B] rounded-xl p-4 gap-4 items-center justify-between text-sm text-white font-bold">
				채점 완료! 고객님의 성적은 C 입니다.

				<button className="bg-[#EF5555] rounded-lg p-2 items-center justify-center text-white font-bold cursor-pointer">
					제응시 D-4개월
				</button>
			</div>
		</div>
	);
}