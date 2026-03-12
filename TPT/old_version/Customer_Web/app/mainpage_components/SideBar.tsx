"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { X, Crown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../stores/authStore";

interface SideBarProps {
	isOpen: boolean;
	onClose: () => void;
}

const SideBar: React.FC<SideBarProps> = ({ isOpen, onClose }) => {
	const router = useRouter();
	const { user, isAuthenticated } = useAuthStore();

	// react portal로 인해, SSR 단계에서는 document 가 없는데,
	// 클라이언트에서는 document.body에 바로 portal을 붙이니까 서버 렌더링된 HTML과 클라이언트가 다르게 나와서 hydration mismatch가 발생
	// useEffect + useState로 마운트 후 portal 연결해서 hydration error 해결
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true); // 클라이언트에서만 true
	}, []);

	if (!mounted) return null; // 서버에서는 렌더링 안 함

	return ReactDOM.createPortal(
		<>
			{isOpen && (
				<div
					onClick={onClose}
					className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
				/>
			)}

			<div
				className={`
          fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
			>
				<div className="flex justify-between items-center p-4 border-b border-gray-300">
					{/* <h2 className="text-lg font-semibold">TPT</h2> */}
					<div className="relative w-16 h-16 sm:w-24 sm:h-24">
						<Image
							src="/images/logo_main.png"
							alt="logo"
							fill
							className="object-contain"
						/>
					</div>
					<button
						onClick={onClose}
						aria-label="메뉴 닫기"
						className="p-2 rounded-md hover:bg-gray-100 cursor-pointer"
					>
						<X size={24} className="text-gray-700" />
					</button>
				</div>

				<nav className="flex flex-col p-4 gap-6 text-gray-700">
					<button
						onClick={() => {
							router.push("/allfeedback");
							onClose();
						}}
						className="text-left font-medium cursor-pointer"
					>
						실시간 TPT 피드백 현황
					</button>

					<button
						onClick={() => {
							router.push("/allpost");
							onClose();
						}}
						className="text-left font-medium cursor-pointer"
					>
						트레이딩 전문가의 칼럼 읽기
					</button>

					<button
						onClick={() => {
							router.push("/review");
							onClose();
						}}
						className="text-left font-medium cursor-pointer"
					>
						TPT 후기 읽기
					</button>

					{isAuthenticated && user?.isSub && (
						<button
							onClick={() => {
								router.push("/lecture");
								onClose();
							}}
							className="flex items-center gap-2 text-left hover:text-[#B9AB70] font-medium"
						>
							<Crown size={16} className="text-[#B9AB70]" />
							트레이딩 전문가의 강의 듣기
						</button>
					)}
				</nav>
			</div>
		</>,
		document.body
	);
};

export default SideBar;
