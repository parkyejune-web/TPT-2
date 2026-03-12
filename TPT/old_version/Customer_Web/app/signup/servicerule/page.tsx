"use client";

export default function ServiceRulePage() {

	const mockData = [
		{
			title: "제1조 (목적)",
			content:
				"이 약관은 TPT 서비스(이하 '회사')가 제공하는 모든 서비스의 이용 조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.",
		},
		{
			title: "제2조 (정의)",
			content:
				"1. '회원'이라 함은 본 약관에 동의하고 서비스를 이용하는 자를 말합니다.\n2. '서비스'라 함은 회사가 제공하는 모든 온라인 서비스 및 관련 제반 기능을 말합니다.",
		},
		{
			title: "제3조 (약관의 효력 및 변경)",
			content:
				"1. 본 약관은 서비스 화면에 게시하거나 기타의 방법으로 공지함으로써 효력이 발생합니다.\n2. 회사는 필요 시 약관을 변경할 수 있으며, 변경 시 서비스 화면에 공지합니다.",
		},
	];

	return (
		<div className="max-w-3xl mx-auto px-6 py-20">
			<h1 className="text-2xl font-bold mb-6">서비스 이용 약관</h1>

			<div className="border rounded-lg p-4 h-[500px] overflow-y-auto bg-gray-50 whitespace-pre-line">
				{mockData.map((rule, idx) => (
					<div key={idx} className="mb-6">
						<h2 className="font-semibold mb-2">{rule.title}</h2>
						<p className="text-gray-700 text-sm">{rule.content}</p>
					</div>
				))}
			</div>
		</div>
	);
}
