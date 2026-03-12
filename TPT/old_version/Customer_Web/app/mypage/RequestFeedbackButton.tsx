import { useRouter } from "next/navigation";

export default function RequestFeedbackButton() {
	const router = useRouter();

	return (
		<button className="w-full bg-gradient-to-r from-[#D2C693] to-[#928346] text-white rounded-md p-6 mb-6 cursor-pointer"
			onClick={() => router.push('/requestfeedback')}
		>
			<p className="text-2xl">피드백 요청하기</p>
		</button>
	);
}