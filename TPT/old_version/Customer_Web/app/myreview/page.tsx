"use client";
import React, { useState } from "react";
import { Send, Edit3, Trash2, ImagePlus } from "lucide-react";
import CustomButton from "../components/CustomButton";
import CustomModal from "../components/CustomModal";

type Complaint = {
	id: number;
	title: string;
	content: string;
	createdAt: string;
	image?: string;
	status: "pending" | "answered";
	answer?: string;
};

export default function MyReview() {
	const [tab, setTab] = useState<"write" | "list">("write");
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [image, setImage] = useState<string | undefined>(undefined);
	const [complaints, setComplaints] = useState<Complaint[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onloadend = () => {
			setImage(reader.result as string);
		};
		reader.readAsDataURL(file);
	};

	const handleSubmit = () => {
		if (!content) return;

		const newComplaint: Complaint = {
			id: complaints.length + 1,
			title,
			content,
			createdAt: new Date().toLocaleString(),
			status: "pending",
			image,
		};

		setComplaints((prev) => [...prev, newComplaint]);
		setTitle("");
		setContent("");
		setImage(undefined);
		setIsModalOpen(true);
		setTab("list");

		// mock 답변 자동 등록
		setTimeout(() => {
			setComplaints((prev) =>
				prev.map((c) =>
					c.id === newComplaint.id
						? {
							...c,
							status: "answered",
							answer: `안녕하세요 고객님, 소중한 후기 감사합니다.`,
						}
						: c
				)
			);
		}, 3000);
	};

	const handleClose = () => {
		setIsModalOpen(false);
	}

	return (
		<div className="max-w-3xl mx-auto p-6 mt-20">
			<h1 className="text-2xl font-semibold mb-2">TPT를 경험하신 후기를 알려주세요.</h1>
			<p className="text-gray-600 mt-6 mb-6">
				소중한 후기를 남겨주셔서 감사합니다.
			</p>

			{/* 탭 */}
			<div className="flex border-b mb-6">
				<button
					onClick={() => setTab("write")}
					className={`px-4 py-2 font-medium cursor-pointer ${tab === "write"
						? "border-b-2 border-black text-black"
						: "text-gray-500"
						}`}
				>
					후기 작성
				</button>
				<button
					onClick={() => setTab("list")}
					className={`px-4 py-2 font-medium cursor-pointer ${tab === "list"
						? "border-b-2 border-black text-black"
						: "text-gray-500"
						}`}
				>
					내 후기 확인
				</button>
			</div>

			{tab === "write" && (
				<div className="space-y-4">
					<div>
						<div className="flex w-full items-center justify-end">
							<label className="inline-flex items-center gap-2 cursor-pointer text-sm text-indigo-600">
								<ImagePlus size={16} />
								이미지 추가
								<input
									type="file"
									accept="image/*"
									className="hidden"
									onChange={handleImageUpload}
								/>
							</label>
						</div>

						<textarea
							value={content}
							onChange={(e) => setContent(e.target.value)}
							placeholder="후기 내용을 입력하세요."
							className="w-full bg-[#F4F4F4] rounded-md px-3 py-2 text-sm h-100"
						/>
						{image && (
							<div className="mt-2">
								<img
									src={image}
									alt="첨부된 이미지"
									className="w-40 h-40 object-cover border rounded-md"
								/>
							</div>
						)}
					</div>
					<CustomButton variant="prettyFull" onClick={handleSubmit}>
						후기 작성하기
					</CustomButton>
				</div>
			)}

			{/* 내 후기 확인 */}
			{tab === "list" && (
				<div className="space-y-4">
					{complaints.length === 0 && (
						<p className="text-gray-500">등록된 후기가 없습니다.</p>
					)}
					{complaints.map((c) => (
						<div
							key={c.id}
							className="rounded-md p-4 bg-[#F4F4F4] text-sm space-y-2"
						>
							<div className="flex justify-between items-center">
								<span className="font-medium">{c.createdAt} 작성</span>
								<div className="flex gap-2">
									<Edit3 size={16} className="cursor-pointer text-gray-500" />
									<Trash2 size={16} className="cursor-pointer text-gray-500" />
								</div>
							</div>
							<p className="font-semibold">{c.title}</p>
							<p className="text-gray-700 whitespace-pre-line">{c.content}</p>
							{c.image && (
								<div className="mt-2">
									<img
										src={c.image}
										alt="고객 첨부 이미지"
										className="w-40 h-40 object-cover border rounded-md"
									/>
								</div>
							)}

							{c.status === "pending" && (
								<p className="text-xs text-gray-500 flex items-center gap-1 mt-2">
									<Send size={14} /> 고객님의 소중한 후기를 관리자가 검토하고
									있습니다. 잠시만 기다려주세요.
								</p>
							)}

							{c.status === "answered" && c.answer && (
								<div className="bg-white border rounded-md p-3 mt-2">
									<p className="text-gray-800 whitespace-pre-line">{c.answer}</p>
									<p className="text-xs text-gray-500 mt-2 text-right">
										2025.8.22. 14:50 답변
									</p>
								</div>
							)}
						</div>
					))}
				</div>
			)}


			<CustomModal variant={1} isOpen={isModalOpen} onClose={handleClose} width="max-w-xl">
				<div className="bg-white w-full text-center">
					<p className="mb-4">
						후기가 성공적으로 저장되었습니다.
						<br />
						앞으로 더욱 노력하는 TPT가 되겠습니다.
						<br />
						소중한 고객님께 감사드립니다.
					</p>
					<CustomButton
						variant="prettyFull"
						onClick={() => setIsModalOpen(false)}
					>
						확인
					</CustomButton>
				</div>
			</CustomModal>

		</div>
	);
}
