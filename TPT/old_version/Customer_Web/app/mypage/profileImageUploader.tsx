"use client";
import { useRef } from "react";
import { Pencil } from "lucide-react";

interface ProfileImageUploaderProps {
	profileImage: string | null; // 부모에서 내려줌
	onChange: (file: File) => void; // 선택한 파일 부모로 전달
}

export default function ProfileImageUploader({
	profileImage,
	onChange,
}: ProfileImageUploaderProps) {
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			onChange(file); // 부모에 파일 전달
		}
	};

	const handleButtonClick = () => {
		fileInputRef.current?.click();
	};

	return (
		<div className="relative w-28 h-28">

			<div className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
				{profileImage ? (
					<img
						src={profileImage}
						alt="profile"
						className="w-full h-full object-cover"
					/>
				) : (
					<span className="text-gray-500">IMG</span>
				)}
			</div>

			<button
				onClick={handleButtonClick}
				className="absolute bottom-1 right-1 bg-white rounded-full p-2 shadow-md border hover:bg-gray-100 cursor-pointer"
			>
				<Pencil size={16} className="text-gray-700" />
			</button>

			{/* 숨겨진 파일 input */}
			<input
				type="file"
				accept="image/*"
				ref={fileInputRef}
				className="hidden"
				onChange={handleFileChange}
			/>
		</div>
	);
}
