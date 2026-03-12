
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import CustomButton from "../components/CustomButton";

type UIDguideProps = {
	isOpen: boolean;
	onClose: () => void;
};

export default function UIDguide({ isOpen, onClose }: UIDguideProps) {
	const modalRef = useRef<HTMLDivElement>(null);

	// ESC 로 닫기
	useEffect(() => {
		if (!isOpen) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [isOpen, onClose]);

	// 모달 외부 클릭으로 닫기
	const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) onClose();
	};

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
			onClick={handleBackdropClick}
			aria-modal="true"
			role="dialog"
			aria-labelledby="uid-guide-title"
		>
			<div
				ref={modalRef}
				className="relative mx-4 w-full max-w-5xl rounded-2xl bg-white shadow-xl"
			>
				{/* 헤더 */}
				<div className="flex items-center justify-between border-b px-5 py-3">
					<h2 id="uid-guide-title" className="text-lg font-semibold">
						UID 가이드
					</h2>
					{/* <button
						type="button"
						aria-label="닫기"
						onClick={onClose}
						className="rounded-md p-2 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
					>
						✕
					</button> */}
				</div>

				{/* 내용 (스크롤) */}
				<div className="max-h-[80vh] overflow-y-auto p-4">

					<div className="relative mx-auto w-full">
						<Image
							src="/images/UIDguide.svg"
							alt="UID 등록 가이드"
							width={1600}
							height={10240}
							priority
							className="h-auto w-full select-none"
						/>
					</div>
				</div>

				{/* 푸터 */}
				<div className="flex justify-end gap-2 border-t px-5 py-3">
					<CustomButton
						variant="prettyFull"
						onClick={onClose}
					>
						닫기
					</CustomButton>
				</div>
			</div>
		</div>
	);
}
