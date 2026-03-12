"use client";

import { useState } from "react";
import { ThumbsUp, MessageCircle } from "lucide-react";
import CustomModal from "../components/CustomModal"; // variant=1
import Image from "next/image";
import CustomButton from "../components/CustomButton";

type Comment = {
	id: number;
	author: string;
	content: string;
	date: string;
};

type PostDetail = {
	id: number;
	title: string;
	content: string;
	createdAt: string;
	likes: number;
	commentsCount: number;
	comments: Comment[];
	assistant: {
		name: string;
		image: string | null;
	};
	trainer: {
		name: string;
		role: string;
		image: string | null;
		intro: string;
	};
};

export default function PostDetailPage() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [liked, setLiked] = useState(false);

	// mockData
	const mockData: PostDetail = {
		id: 1,
		title: "칼럼 제목 최대 30 글자 가나다라마바사",
		content:
			"칼럼 내용. 가나다라 마바사 아자차카타파하)",
		createdAt: "2025.7.6 작성",
		likes: 99,
		commentsCount: 30,
		comments: [
			{
				id: 1,
				author: "banana@gmail.com",
				content: "좋은 정보 감사합니다.",
				date: "2025.6.15 23:11",
			},
			{
				id: 2,
				author: "qwer@gmail.com",
				content: "잘 읽었습니다. 감사합니다.",
				date: "2025.6.15 23:11",
			},
		],
		assistant: {
			name: "조교 이름",
			image: null,
		},
		trainer: {
			name: "양성현",
			role: "트레이너",
			image: null,
			intro:
				"여기에 한줄소개 여기에 한줄소개 여기에 한줄소개 여기에 한줄소개",
		},
	};

	return (
		<div className="max-w-6xl mx-auto px-6 pb-20 pt-20 flex flex-col md:flex-row gap-10 mt-20">
			{/* 좌측: 조교 프로필 */}
			<div className="w-full md:w-1/4 flex flex-col items-center">
				<div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
					{mockData.assistant.image ? (
						<Image
							src={mockData.assistant.image}
							alt="조교 이미지"
							width={96}
							height={96}
							className="rounded-full"
						/>
					) : (
						<span className="text-sm text-gray-500">조교 이미지</span>
					)}
				</div>
				<span className="font-medium mb-2">{mockData.assistant.name}</span>
				<button
					className="text-xs text-gray-400 border border-gray-300 rounded-md p-2 cursor-pointer"
					onClick={() => setIsModalOpen(true)}
				>
					트레이너 프로필 보기
				</button>
			</div>

			{/* 우측: 본문 및 댓글 */}
			<div className="w-full md:w-3/4 flex flex-col">
				{/* 제목 + 날짜 + 좋아요/댓글 */}
				<div className="mb-6 border-b border-gray-200 pb-4">
					<h1 className="text-2xl font-bold mb-2">{mockData.title}</h1>
					<div className="flex justify-between items-center">
						<p className="text-gray-500 text-sm">{mockData.createdAt}</p>
						<div className="flex items-center gap-4 text-sm text-gray-600">
							<div className="flex items-center gap-1">
								<ThumbsUp size={16} />
								<span>{mockData.likes}</span>
							</div>
							<div className="flex items-center gap-1">
								<MessageCircle size={16} />
								<span>{mockData.commentsCount}</span>
							</div>
						</div>
					</div>
				</div>

				{/* 본문 */}
				<p className="text-gray-800 mb-6 whitespace-pre-line">{mockData.content}</p>
				<div className="w-full h-32 bg-gray-200 flex items-center justify-center text-gray-500 mb-6">
					칼럼에 첨부한 이미지
				</div>

				<p className="text-gray-800 mb-6 whitespace-pre-line">{mockData.content}</p>
				<div className="w-full h-32 bg-gray-200 flex items-center justify-center text-gray-500 mb-6">
					칼럼에 첨부한 이미지
				</div>

				<div className="flex justify-between w-full mt-20">
					<div className="flex items-center gap-4 text-sm text-gray-600">
						<button
							onClick={() => setLiked((prev) => !prev)}
							className={`flex items-center gap-1 cursor-pointer px-2 py-1 rounded 
				  ${liked ? "bg-blue-100 text-blue-600" : ""}`}
						>
							<ThumbsUp
								size={16}
								className={liked ? "fill-blue-600 text-blue-600" : ""}
							/>
							<span>좋아요 {mockData.likes + (liked ? 1 : 0)}</span>
						</button>
						<button className="flex items-center gap-1 cursor-pointer">
							<MessageCircle size={16} />
							<span>댓글 {mockData.commentsCount}</span>
						</button>
					</div>

					<CustomButton variant="prettyFull">
						구독하고 트레이닝 받으러 가기
					</CustomButton>
				</div>

				{/* 댓글 입력 */}
				<textarea
					placeholder="댓글을 작성해보세요."
					className="w-full border rounded p-2 mb-6 mt-6"
				/>

				{/* 댓글 리스트 */}
				<div className="flex flex-col gap-4">
					{mockData.comments.map((c) => (
						<div key={c.id} className="border-b border-gray-300 pb-2">
							<p className="text-sm font-medium">{c.author}</p>
							<p className="text-gray-700 text-sm">{c.content}</p>
							<p className="text-xs text-gray-400">{c.date}</p>
						</div>
					))}
				</div>
			</div>

			{/* 트레이너 정보 모달 */}
			<CustomModal
				variant={1}
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				width="max-w-2xl"
			>
				<div className="flex gap-6">
					<div className="w-40 h-40 bg-gray-200 flex items-center justify-center">
						{mockData.trainer.image ? (
							<Image
								src={mockData.trainer.image}
								alt="트레이너 이미지"
								width={160}
								height={160}
							/>
						) : (
							<span className="text-sm text-gray-500">트레이너 프로필 사진</span>
						)}
					</div>
					<div className="flex flex-col gap-4">
						<h2 className="text-xl font-bold">
							{mockData.trainer.name}{" "}
							<span className="text-gray-600">{mockData.trainer.role}</span>
						</h2>
						<p className="text-gray-700">{mockData.trainer.intro}</p>
						<CustomButton variant="prettyFull">
							구독하고 트레이닝 받으러 가기
						</CustomButton>
					</div>
				</div>
			</CustomModal>
		</div>
	);
}
