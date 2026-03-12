"use client";

import { useState, useEffect } from "react";
import { X, TrendingUp, AlertCircle } from "lucide-react";
import CustomModal from "../../Shared/ui/CustomModal";
import {
  getMyChangeRequests,
  createChangeRequest,
  cancelChangeRequest,
  type InvestmentType,
  type ChangeRequestResponse,
} from "../../Shared/api/services/investmentTypeChangeService";

type InvestmentTypeChangeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentType: InvestmentType;
};

const INVESTMENT_TYPE_LABELS: Record<InvestmentType, string> = {
  SWING: "스윙",
  DAY: "데이",
  SCALPING: "스켈핑",
};

const INVESTMENT_TYPE_DESCRIPTIONS: Record<InvestmentType, string> = {
  SWING: "중장기 포지션 매매 (수일~수주)",
  DAY: "일간 매매 (당일 청산)",
  SCALPING: "초단타 매매 (수분~수십분)",
};

const STATUS_LABELS: Record<string, { text: string; color: string }> = {
  PENDING: { text: "대기중", color: "text-yellow-600 bg-yellow-100" },
  APPROVED: { text: "승인됨", color: "text-green-600 bg-green-100" },
  REJECTED: { text: "거절됨", color: "text-red-600 bg-red-100" },
  CANCELLED: { text: "취소됨", color: "text-gray-600 bg-gray-100" },
};

export default function InvestmentTypeChangeModal({
  isOpen,
  onClose,
  currentType,
}: InvestmentTypeChangeModalProps) {
  const [activeTab, setActiveTab] = useState<"request" | "myRequests">("request");
  const [selectedType, setSelectedType] = useState<InvestmentType | null>(null);
  const [reason, setReason] = useState("");
  const [myRequests, setMyRequests] = useState<ChangeRequestResponse[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const investmentTypes: InvestmentType[] = ["SWING", "DAY", "SCALPING"];

  // 내 신청 목록 조회
  const fetchMyRequests = async () => {
    setIsLoadingRequests(true);
    try {
      const response = await getMyChangeRequests();
      if (response.success && response.data) {
        setMyRequests(response.data);
      } else {
        console.error("변경 신청 목록 조회 실패:", response.message);
        setMyRequests([]);
      }
    } catch (error) {
      console.error("변경 신청 목록 조회 중 오류:", error);
      setMyRequests([]);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  // 탭 변경 시 내 신청 목록 조회
  useEffect(() => {
    if (activeTab === "myRequests") {
      fetchMyRequests();
    }
  }, [activeTab]);

  // 변경 신청
  const handleSubmit = async () => {
    if (!selectedType) {
      alert("변경할 투자 유형을 선택해주세요.");
      return;
    }

    if (selectedType === currentType) {
      alert("현재 투자 유형과 동일합니다.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await createChangeRequest({
        requestedType: selectedType,
        reason: reason || undefined,
      });

      if (response.success) {
        setSuccessMessage(
          `투자 유형 변경 신청이 완료되었습니다.\n${INVESTMENT_TYPE_LABELS[currentType]} → ${INVESTMENT_TYPE_LABELS[selectedType]}\n\n관리자 승인 후 변경됩니다.`
        );
        setIsSuccessModalOpen(true);
        setSelectedType(null);
        setReason("");
        setActiveTab("myRequests");
      } else {
        alert(`변경 신청에 실패했습니다: ${response.message}`);
      }
    } catch (error) {
      console.error("변경 신청 중 오류:", error);
      alert("변경 신청 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 신청 취소
  const handleCancel = async (requestId: number) => {
    if (!confirm("정말로 이 신청을 취소하시겠습니까?")) return;

    try {
      const response = await cancelChangeRequest(requestId);
      if (response.success) {
        alert("신청이 취소되었습니다.");
        fetchMyRequests();
      } else {
        alert(`신청 취소에 실패했습니다: ${response.message}`);
      }
    } catch (error) {
      console.error("신청 취소 중 오류:", error);
      alert("신청 취소 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <CustomModal variant={1} isOpen={isOpen} onClose={onClose} width="800px">
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-blue-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">투자 유형 변경 신청</h2>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition">
              <X size={24} />
            </button>
          </div>

          {/* 현재 투자 유형 표시 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 mb-1">현재 투자 유형</p>
            <p className="text-lg font-bold text-blue-900">
              {INVESTMENT_TYPE_LABELS[currentType]} ({INVESTMENT_TYPE_DESCRIPTIONS[currentType]})
            </p>
          </div>

          {/* 탭 */}
          <div className="flex border-b mb-6">
            <button
              onClick={() => setActiveTab("request")}
              className={`px-6 py-3 font-medium transition ${
                activeTab === "request"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              변경 신청
            </button>
            <button
              onClick={() => setActiveTab("myRequests")}
              className={`px-6 py-3 font-medium transition ${
                activeTab === "myRequests"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              내 신청 확인
            </button>
          </div>

          {/* 변경 신청 탭 */}
          {activeTab === "request" && (
            <div className="space-y-6">
              {/* 투자 유형 선택 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">변경할 투자 유형을 선택해주세요</h3>
                <div className="grid grid-cols-1 gap-3">
                  {investmentTypes.map((type) => (
                    <button
                      key={type}
                      disabled={type === currentType}
                      onClick={() => setSelectedType(type)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        type === currentType
                          ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-50"
                          : selectedType === type
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-gray-900 mb-1">
                            {INVESTMENT_TYPE_LABELS[type]}
                          </p>
                          <p className="text-sm text-gray-600">{INVESTMENT_TYPE_DESCRIPTIONS[type]}</p>
                        </div>
                        {type === currentType && (
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                            현재
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 변경 사유 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  변경 사유 (선택사항)
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="투자 유형을 변경하려는 이유를 입력해주세요."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>

              {/* 안내 메시지 */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex gap-2">
                  <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">안내사항</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>투자 유형 변경은 관리자 승인 후 적용됩니다.</li>
                      <li>승인까지 1~2영업일 소요될 수 있습니다.</li>
                      <li>변경 신청은 언제든 취소할 수 있습니다.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 신청 버튼 */}
              <button
                onClick={handleSubmit}
                disabled={!selectedType || isSubmitting}
                className={`w-full rounded-md py-3 text-base font-semibold transition-all ${
                  selectedType && !isSubmitting
                    ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? "신청 중..." : "변경 신청하기"}
              </button>
            </div>
          )}

          {/* 내 신청 확인 탭 */}
          {activeTab === "myRequests" && (
            <div>
              {isLoadingRequests ? (
                <div className="text-center py-12 text-gray-500">신청 목록을 불러오는 중...</div>
              ) : myRequests.length === 0 ? (
                <div className="text-center py-12">
                  <TrendingUp className="mx-auto mb-4 text-gray-300" size={48} />
                  <p className="text-gray-500">변경 신청 내역이 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`text-xs font-semibold px-2 py-1 rounded ${
                                STATUS_LABELS[request.status]?.color || "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {STATUS_LABELS[request.status]?.text || request.status}
                            </span>
                            <span className="text-xs text-gray-500">{request.requestedDate}</span>
                          </div>
                          <p className="font-semibold text-lg text-gray-900 mb-1">
                            {INVESTMENT_TYPE_LABELS[request.currentType]} →{" "}
                            {INVESTMENT_TYPE_LABELS[request.requestedType]}
                          </p>
                          {request.reason && (
                            <p className="text-sm text-gray-600 mb-2">사유: {request.reason}</p>
                          )}
                          <p className="text-xs text-gray-500">
                            변경 예정일: {request.targetChangeDate}
                          </p>
                        </div>
                        {request.status === "PENDING" && (
                          <button
                            onClick={() => handleCancel(request.id)}
                            className="px-3 py-1 text-sm border border-red-500 text-red-600 rounded hover:bg-red-50 transition"
                          >
                            취소
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </CustomModal>

      {/* 완료 모달 */}
      <CustomModal
        variant={1}
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      >
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <TrendingUp className="text-green-600" size={32} />
          </div>
          <p className="text-lg font-semibold mb-4">신청 완료</p>
          <p className="text-sm text-gray-700 whitespace-pre-line mb-6">{successMessage}</p>
          <button
            onClick={() => {
              setIsSuccessModalOpen(false);
              fetchMyRequests();
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            확인
          </button>
        </div>
      </CustomModal>
    </>
  );
}
