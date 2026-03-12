"use client";

import { UserStatus } from "../mocks/status";

// 트레이너 mock data
const mockTrainer = {
	name: "양성현",
	intro: "여기에 한줄소개 여기에 한줄소개 여기에 한줄소개.",
	profileImage: null,
};

type Props = {
	state: UserStatus;
};

export default function TrainerInfo({ state }: Props) {
	if (state === "TRAINER_ASSIGNED") {
		// 트레이너 배정 완료 화면
		return (
			<div className="p-6 bg-white text-left w-full items-start">
				<h2 className="text-xl font-bold text-gray-900 mb-4">담당 트레이너</h2>
				<div className="flex items-start gap-4">
					{/* 프로필 이미지 (null 처리) */}
					<div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500 overflow-hidden">
						{mockTrainer.profileImage ? (
							<img
								src={mockTrainer.profileImage}
								alt="트레이너 프로필"
								className="w-full h-full object-cover"
							/>
						) : (
							"프로필"
						)}
					</div>

					{/* 트레이너 정보 */}
					<div>
						<p className="text-lg font-semibold">{mockTrainer.name}</p>
						<div className="mt-2 border-l-4 border-[#B9AB70] pl-3 bg-[#fdfdf6]">
							<p className="text-sm text-gray-700">{mockTrainer.intro}</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	// 트레이너 매칭 중 화면 (원형 로딩 인디케이터)
	return (
		<div className="p-6 bg-white text-left max-w-xl mx-auto">
			<h2 className="text-xl font-bold text-gray-900 mb-4">담당 트레이너</h2>
			<div className="flex items-center gap-4">
				{/* 원형 로딩 인디케이터 */}
				<div className="relative w-24 h-24">
					{/* gradient spinner */}
					<div className="absolute inset-0 rounded-full border-4 border-transparent 
                          bg-gradient-to-r from-[#B9AB70] via-[#e4d9a6] to-[#B9AB70] 
                          animate-spin"></div>
					{/* 안쪽 흰색 원 */}
					<div className="absolute inset-[4px] rounded-full bg-white"></div>
				</div>

				{/* 안내 문구 */}
				<div>
					<p className="text-[#B9AB70] font-semibold">매칭이 이뤄지는 중...</p>
					<p className="text-sm text-[#B9AB70] mt-2">
						고객님께 꼭 맞는 트레이너를 고르고 있어요.
						<br />
						24시간 이내 트레이너가 매칭됩니다.
						<br />
						매칭이 완료되면 트레이너의 프로필을 조회하실 수 있어요.
					</p>
				</div>
			</div>
		</div>
	);
}
