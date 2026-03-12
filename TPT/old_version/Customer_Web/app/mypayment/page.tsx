"use client";

import { useState } from "react";
import { CreditCard, Trash2, Plus } from "lucide-react";
import CustomModal from "../components/CustomModal";
import CustomButton from "../components/CustomButton";

type PaymentMethod = {
	id: number;
	cardNumber: string;
	cardHolder: string;
	expiry: string;
};

export default function MyPayment() {
	const [payments, setPayments] = useState<PaymentMethod[]>([
		{ id: 1, cardNumber: "**** **** **** 1234", cardHolder: "홍길동", expiry: "12/26" },
		{ id: 2, cardNumber: "**** **** **** 5678", cardHolder: "이순신", expiry: "05/27" },
	]);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [newCard, setNewCard] = useState({ cardNumber: "", cardHolder: "", expiry: "" });

	// 결제수단 등록
	const handleAddPayment = () => {
		if (!newCard.cardNumber || !newCard.cardHolder || !newCard.expiry) return;

		const newPayment: PaymentMethod = {
			id: payments.length + 1,
			cardNumber: `**** **** **** ${newCard.cardNumber.slice(-4)}`,
			cardHolder: newCard.cardHolder,
			expiry: newCard.expiry,
		};

		setPayments([...payments, newPayment]);
		setNewCard({ cardNumber: "", cardHolder: "", expiry: "" });
		setIsModalOpen(false);
	};

	// 결제수단 삭제
	const handleDeletePayment = (id: number) => {
		setPayments(payments.filter((p) => p.id !== id));
	};

	return (
		<div className="max-w-3xl mx-auto p-6 pt-20">
			<h1 className="text-2xl font-bold mb-6">결제수단 관리</h1>

			{/* 결제수단 목록 */}
			<div className="flex flex-col gap-4 mb-6">
				{payments.length > 0 ? (
					payments.map((p) => (
						<div
							key={p.id}
							className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm"
						>
							<div className="flex items-center gap-3">
								<CreditCard size={20} className="text-gray-600" />
								<div>
									<p className="font-medium">{p.cardNumber}</p>
									<p className="text-sm text-gray-600">
										{p.cardHolder} | {p.expiry}
									</p>
								</div>
							</div>
							<button
								onClick={() => handleDeletePayment(p.id)}
								className="text-red-500 hover:text-red-700 cursor-pointer"
							>
								<Trash2 size={18} />
							</button>
						</div>
					))
				) : (
					<p className="text-gray-500">등록된 결제수단이 없습니다.</p>
				)}
			</div>

			{/* 등록 버튼 */}
			<CustomButton variant="prettyFull" onClick={() => setIsModalOpen(true)}>
				<Plus size={16} className="mr-2" /> 결제수단 등록
			</CustomButton>

			{/* 등록 모달 */}
			<CustomModal
				variant={1}
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				width="max-w-md"
			>
				<h2 className="text-lg font-bold mb-4">결제수단 등록</h2>

				<div className="flex flex-col gap-3">
					<input
						type="text"
						placeholder="카드 번호 (16자리)"
						value={newCard.cardNumber}
						onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
						className="border p-2 rounded"
					/>
					<input
						type="text"
						placeholder="카드 소유자명"
						value={newCard.cardHolder}
						onChange={(e) => setNewCard({ ...newCard, cardHolder: e.target.value })}
						className="border p-2 rounded"
					/>
					<input
						type="text"
						placeholder="만료일 (MM/YY)"
						value={newCard.expiry}
						onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
						className="border p-2 rounded"
					/>
				</div>

				<div className="flex justify-end gap-3 mt-6">
					<CustomButton variant="redClean" onClick={() => setIsModalOpen(false)}>
						취소
					</CustomButton>
					<CustomButton variant="prettyFull" onClick={handleAddPayment}>
						등록하기
					</CustomButton>
				</div>
			</CustomModal>
		</div>
	);
}
