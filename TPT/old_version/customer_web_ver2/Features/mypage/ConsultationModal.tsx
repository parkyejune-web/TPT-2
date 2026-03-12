"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import CustomModal from "../../Shared/ui/CustomModal";
import { Phone, X } from "lucide-react";
import {
  getConsultationAvailability,
  createConsultation,
  getMyConsultations,
  updateConsultation,
  deleteConsultation,
} from "../../Shared/api/services/consultationService";

type TimeSlot = {
  time: string;
  available: boolean;
};

type Consultation = {
  id: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
};

type ConsultationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const router = useRouter();

  // 탭 (예약 신청 / 내 예약)
  const [activeTab, setActiveTab] = useState<"book" | "myList">("book");

  // 예약 신청
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // 내 예약
  const [myConsultations, setMyConsultations] = useState<Consultation[]>([]);
  const [isLoadingMyList, setIsLoadingMyList] = useState(false);

  // 예약 변경
  const [editingConsultation, setEditingConsultation] = useState<Consultation | null>(null);

  // 완료 모달
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // 시간 슬롯을 시간 문자열로 변환하는 함수
  const convertSlotToTime = (slot: string): string => {
    const hour = slot.replace("H", "");
    return `${hour}:00`;
  };

  // 날짜를 YYYY-MM-DD 형식으로 변환하는 함수
  const formatDateForAPI = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 날짜 표시 포맷
  const formatDate = (date: Date) => {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  // 날짜 선택 시 해당 날짜의 상담 가능 시간대 조회
  useEffect(() => {
    if (!selectedDate) return;

    const fetchAvailableSlots = async () => {
      setIsLoadingSlots(true);
      try {
        const dateStr = formatDateForAPI(selectedDate);
        const response = await getConsultationAvailability(dateStr);

        if (response.success && response.data) {
          // API 응답을 TimeSlot 타입으로 변환
          const slots: TimeSlot[] = response.data.map((slot: any) => ({
            time: convertSlotToTime(slot.timeSlot),
            available: slot.available,
          }));
          setTimeSlots(slots);
        } else {
          console.error("상담 가능 시간대 조회 실패:", response.message);
          setTimeSlots([]);
        }
      } catch (error) {
        console.error("상담 가능 시간대 조회 중 오류:", error);
        setTimeSlots([]);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchAvailableSlots();
  }, [selectedDate]);

  // 내 예약 목록 조회
  const fetchMyConsultations = async () => {
    setIsLoadingMyList(true);
    try {
      const response = await getMyConsultations();
      if (response.success && response.data) {
        setMyConsultations(response.data);
      } else {
        console.error("내 예약 목록 조회 실패:", response.message);
        setMyConsultations([]);
      }
    } catch (error) {
      console.error("내 예약 목록 조회 중 오류:", error);
      setMyConsultations([]);
    } finally {
      setIsLoadingMyList(false);
    }
  };

  // 탭 변경 시 내 예약 목록 조회
  useEffect(() => {
    if (activeTab === "myList") {
      fetchMyConsultations();
    }
  }, [activeTab]);

  // 상담 예약 신청
  const handleReserve = async () => {
    if (!selectedDate || !selectedTime) return;

    try {
      const dateStr = formatDateForAPI(selectedDate);
      const timeStr = `${selectedTime}:00`;

      if (editingConsultation) {
        // 예약 변경
        const response = await updateConsultation({
          oldConsultationId: editingConsultation.id,
          newDate: dateStr,
          newTime: timeStr,
        });

        if (response.success) {
          setSuccessMessage(
            "상담 예약이 변경되었습니다.\n선택하신 일시에 고객님의 연락처로 전화를 드릴 예정입니다."
          );
          setIsSuccessModalOpen(true);
          setEditingConsultation(null);
          setSelectedDate(null);
          setSelectedTime(null);
          setActiveTab("myList");

          // 예약 변경 완료 이벤트 발생
          window.dispatchEvent(new CustomEvent('consultationUpdated'));
        } else {
          alert(`상담 예약 변경에 실패했습니다: ${response.message}`);
        }
      } else {
        // 새 예약
        const response = await createConsultation({
          date: dateStr,
          time: timeStr,
        });

        if (response.success) {
          setSuccessMessage(
            "전화 상담 신청이 완료되었습니다.\n선택하신 일시에 고객님의 연락처로 전화를 드릴 예정입니다."
          );
          setIsSuccessModalOpen(true);
          setSelectedDate(null);
          setSelectedTime(null);
          setActiveTab("myList");

          // 예약 생성 완료 이벤트 발생
          window.dispatchEvent(new CustomEvent('consultationUpdated'));
        } else {
          alert(`상담 예약에 실패했습니다: ${response.message}`);
        }
      }
    } catch (error) {
      console.error("상담 예약 중 오류:", error);
      alert("상담 예약 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 예약 삭제
  const handleDelete = async (consultationId: number) => {
    if (!confirm("정말로 이 예약을 취소하시겠습니까?")) return;

    try {
      const response = await deleteConsultation(consultationId);
      if (response.success) {
        alert("예약이 취소되었습니다.");
        fetchMyConsultations();

        // 예약 삭제 완료 이벤트 발생
        window.dispatchEvent(new CustomEvent('consultationUpdated'));
      } else {
        alert(`예약 취소에 실패했습니다: ${response.message}`);
      }
    } catch (error) {
      console.error("예약 취소 중 오류:", error);
      alert("예약 취소 중 오류가 발생했습니다.");
    }
  };

  // 예약 변경 시작
  const handleEdit = (consultation: Consultation) => {
    setEditingConsultation(consultation);
    setActiveTab("book");
    // 기존 예약 날짜와 시간을 선택된 상태로 설정
    const [year, month, day] = consultation.date.split("-").map(Number);
    setSelectedDate(new Date(year, month - 1, day));
    const [hour] = consultation.time.split(":");
    setSelectedTime(`${hour}:00`);
  };

  // 예약 변경 취소
  const handleCancelEdit = () => {
    setEditingConsultation(null);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  return (
    <>
      <CustomModal variant={1} isOpen={isOpen} onClose={onClose} width="800px">
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Phone className="text-blue-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">전화 상담 예약</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <X size={24} />
            </button>
          </div>

          {/* 탭 */}
          <div className="flex border-b mb-6">
            <button
              onClick={() => setActiveTab("book")}
              className={`px-6 py-3 font-medium transition ${
                activeTab === "book"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              상담 예약
            </button>
            <button
              onClick={() => setActiveTab("myList")}
              className={`px-6 py-3 font-medium transition ${
                activeTab === "myList"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              내 예약 확인
            </button>
          </div>

          {/* 예약 신청 탭 */}
          {activeTab === "book" && (
            <div className="space-y-8">
              {editingConsultation && (
                <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                  <p className="text-sm font-semibold text-yellow-800 mb-2">
                    예약 변경 중
                  </p>
                  <p className="text-sm text-yellow-700">
                    기존 예약: {editingConsultation.date} {editingConsultation.time}
                  </p>
                  <button
                    onClick={handleCancelEdit}
                    className="mt-2 text-sm text-yellow-800 underline hover:text-yellow-900"
                  >
                    변경 취소
                  </button>
                </div>
              )}

              {/* 날짜 선택 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">1. 상담 날짜를 선택해주세요</h3>
                <div className="flex flex-col gap-4">
                  <Calendar
                    onChange={(date) => {
                      setSelectedDate(date as Date);
                      setSelectedTime(null);
                    }}
                    value={selectedDate}
                    minDate={new Date()}
                    className="rounded-md w-full border"
                  />
                  <div className="text-sm">
                    <p className="text-gray-600 mb-1">선택하신 날짜:</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedDate ? formatDate(selectedDate) : "날짜를 선택해주세요"}
                    </p>
                  </div>
                </div>
              </div>

              {/* 시간 선택 */}
              <div>
                <h3 className="text-lg font-semibold mb-2">2. 상담 시간을 선택해주세요</h3>
                <p className="text-sm text-gray-500 mb-4">
                  상담은 유선으로 진행되며, 약 1시간 소요됩니다.
                </p>

                <div className="grid grid-cols-3 gap-3">
                  {isLoadingSlots ? (
                    <div className="col-span-3 text-center py-8 text-gray-500">
                      상담 가능 시간대를 불러오는 중...
                    </div>
                  ) : timeSlots.length === 0 ? (
                    <div className="col-span-3 text-center py-8 text-gray-500">
                      날짜를 선택하면 상담 가능 시간대가 표시됩니다.
                    </div>
                  ) : (
                    timeSlots.map(({ time, available }) => (
                      <button
                        key={time}
                        disabled={!available}
                        onClick={() => setSelectedTime(time)}
                        className={`rounded-md border px-4 py-3 text-sm font-medium transition-all ${
                          !available
                            ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                            : selectedTime === time
                            ? "bg-blue-100 border-blue-500 text-blue-700"
                            : "border-gray-300 text-gray-800 hover:bg-gray-50"
                        }`}
                      >
                        {time < "12:00" ? `오전 ${time}` : `오후 ${time}`}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* 선택한 일시 안내 */}
              {selectedDate && selectedTime && (
                <div className="border-t pt-6">
                  <p className="text-gray-700 mb-2">
                    선택하신 상담 일시는{" "}
                    <span className="font-semibold text-gray-900">
                      {formatDate(selectedDate)} {selectedTime < "12:00" ? "오전" : "오후"}{" "}
                      {selectedTime}
                    </span>{" "}
                    입니다.
                  </p>
                  <p className="text-sm text-gray-500">
                    트레이너가 상담 일시에 맞추어 전화를 드릴 예정입니다.
                  </p>
                </div>
              )}

              {/* 상담 신청 버튼 */}
              <button
                onClick={handleReserve}
                disabled={!selectedDate || !selectedTime}
                className={`w-full rounded-md py-3 text-base font-semibold transition-all ${
                  selectedDate && selectedTime
                    ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {editingConsultation ? "예약 변경하기" : "상담 신청하기"}
              </button>
            </div>
          )}

          {/* 내 예약 확인 탭 */}
          {activeTab === "myList" && (
            <div>
              {isLoadingMyList ? (
                <div className="text-center py-12 text-gray-500">
                  예약 목록을 불러오는 중...
                </div>
              ) : myConsultations.length === 0 ? (
                <div className="text-center py-12">
                  <Phone className="mx-auto mb-4 text-gray-300" size={48} />
                  <p className="text-gray-500">예약된 상담이 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myConsultations.map((consultation) => (
                    <div
                      key={consultation.id}
                      className="border rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-lg text-gray-900 mb-1">
                            {consultation.date}
                          </p>
                          <p className="text-gray-600">
                            {consultation.time.substring(0, 5)} (약 1시간 소요)
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(consultation)}
                            className="px-3 py-1 text-sm border border-blue-500 text-blue-600 rounded hover:bg-blue-50 transition"
                          >
                            변경
                          </button>
                          <button
                            onClick={() => handleDelete(consultation.id)}
                            className="px-3 py-1 text-sm border border-red-500 text-red-600 rounded hover:bg-red-50 transition"
                          >
                            취소
                          </button>
                        </div>
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
            <Phone className="text-green-600" size={32} />
          </div>
          <p className="text-lg font-semibold mb-4">완료</p>
          <p className="text-sm text-gray-700 whitespace-pre-line mb-6">
            {successMessage}
          </p>
          <button
            onClick={() => {
              setIsSuccessModalOpen(false);
              fetchMyConsultations();
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
