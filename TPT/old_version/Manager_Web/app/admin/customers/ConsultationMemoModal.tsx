'use client';
import CustomButton from "@/app/components/CustomButton";
import CustomModal from "@/app/components/CustomModal";

interface Props {
  memoText: string;
  onChange: (text: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export default function ConsultationMemoModal({ memoText, onChange, onSave, onClose }: Props) {
  return (
    <CustomModal onClose={onClose}>
      <div className="p-6">
        <h3 className="text-lg font-bold mb-4">상담 메모</h3>
        <textarea
          value={memoText}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-h-[200px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-end gap-3 mt-4">
          <CustomButton variant="secondary" onClick={onClose}>취소</CustomButton>
          <CustomButton variant="primary" onClick={onSave}>저장</CustomButton>
        </div>
      </div>
    </CustomModal>
  );
}
