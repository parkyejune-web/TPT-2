'use client';

interface Props {
  consultations: any[];
  onToggle: (id: number) => void;
  onShowMemo: (id: number, memo: string) => void;
}

export default function ConsultationsTable({ consultations, onToggle, onShowMemo }: Props) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">신규 상담 신청</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['성함', '전화번호', '신청일시', '상담일시', '처리 여부', '메모'].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {consultations.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-6 text-gray-500"
                >
                  신규 상담이 없습니다.
                </td>
              </tr>
            ) : (
              consultations.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{c.name}</td>
                  <td className="px-6 py-4 text-sm">{c.phone}</td>
                  <td className="px-6 py-4 text-sm">{c.requestedAt}</td>
                  <td className="px-6 py-4 text-sm">{c.consultationDate}</td>
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={c.isCompleted}
                      onChange={() => onToggle(c.id)}
                      className="cursor-pointer accent-green-600 w-4 h-4"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onShowMemo(c.id, c.memo || '')}
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      메모 보기
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
