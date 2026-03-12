"use client";

type Review = {
  id: number;
  memberName: string;
  week: number;
  subtitle: string;
  content: string;
};

const reviews: Review[] = [
  {
    id: 1,
    memberName: "김OO",
    week: 6,
    subtitle: "3천만 원에서 6천만 원까지 그 과정",
    content:
      "처음에는 반신반의했지만, 매일 매매일지를 작성하고 피드백을 받으면서 제 트레이딩 패턴의 문제점을 명확히 알게 되었습니다. 특히 손절 타이밍과 포지션 사이징에 대한 조언이 큰 도움이 되었습니다. 6주 만에 자산이 2배가 된 것도 놀랍지만, 더 중요한 건 이제 제가 왜 수익을 내는지, 왜 손실을 보는지 정확히 알게 되었다는 점입니다.",
  },
  {
    id: 2,
    memberName: "이OO",
    week: 4,
    subtitle: "감정 트레이딩에서 시스템 트레이딩으로",
    content:
      "TPT를 시작하기 전에는 차트만 보면 감정적으로 진입하고 빠져나오기를 반복했습니다. 손실이 나면 복구하려고 무리한 레버리지를 쓰고, 수익이 나면 욕심을 부려 더 버티다가 다시 손실로 돌아가곤 했죠. 하지만 매주 받는 피드백을 통해 제 감정 패턴을 객관적으로 볼 수 있게 되었고, 이제는 정해진 룰대로만 매매합니다.",
  },
  {
    id: 3,
    memberName: "박OO",
    week: 8,
    subtitle: "손실 통제의 진짜 의미를 알게 된 시간",
    content:
      "8주간 TPT와 함께하면서 가장 큰 깨달음은 '수익을 내는 것'보다 '손실을 통제하는 것'이 먼저라는 점이었습니다. 담당 트레이너님이 매주 제 매매를 분석해주시면서 손절 포인트를 명확히 잡는 법, 리스크를 관리하는 법을 체계적으로 배웠습니다. 이제는 큰 손실 없이 안정적으로 수익을 유지하고 있습니다.",
  },
];

export function MemberReviewSection() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">TPT 회원 후기</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                TPT {review.memberName} 회원님
              </h3>
              <p className="text-sm text-gray-600">
                {review.week}주차 ETCC {review.memberName}님
              </p>
              <p className="text-sm font-semibold text-blue-600 mt-1">
                {review.subtitle}
              </p>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed">
              {review.content}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
