"use client";

export default function MyInfoRulePage() {

	const mockData = [
		{
			title: "제1조 (개인정보 수집 항목)",
			content:
				"회사는 회원가입, 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다.\n- 필수 항목: 이름, 이메일, 비밀번호\n- 선택 항목: 프로필 사진, 연락처",
		},
		{
			title: "제2조 (개인정보 수집 및 이용 목적)",
			content:
				"1. 서비스 제공 및 계약 이행\n2. 회원 관리 및 고객 상담\n3. 서비스 품질 개선 및 신규 서비스 개발",
		},
		{
			title: "제3조 (개인정보 보유 및 이용 기간)",
			content:
				"회원 탈퇴 시 즉시 파기합니다. 단, 관련 법령에 의해 보존할 필요가 있는 경우 일정 기간 동안 보관할 수 있습니다.",
		},
	];

	return (
		<div className="max-w-3xl mx-auto px-6 py-20">
			<h1 className="text-2xl font-bold mb-6">개인정보 이용 약관</h1>

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
