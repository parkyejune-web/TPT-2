export default function MyPageSidebarSkeleton() {
	return (
		<aside className="w-full md:w-64 bg-[#0f172a] text-white flex flex-col items-center py-10 animate-pulse gap-3">
			{/* 프로필 이미지 자리 */}
			<div className="w-20 h-20 bg-gray-600 rounded-full mb-4" />

			{/* 이름 */}
			<div className="w-24 h-4 bg-gray-600 rounded mb-6" />

			{/* 계정 정보 */}
			<div className="bg-white/10 rounded-lg px-4 py-3 w-52 text-sm mb-6">
				<div className="w-full h-3 bg-gray-600 rounded mb-2" />
				<div className="w-2/3 h-3 bg-gray-600 rounded" />
			</div>

			{/* 메뉴 버튼 자리 */}
			<nav className="flex flex-col gap-3 w-52">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="w-full h-4 bg-gray-600 rounded" />
				))}
			</nav>

			{/* 로그아웃 등 */}
			<div className="mt-auto flex flex-col gap-3 w-52">
				{Array.from({ length: 3 }).map((_, i) => (
					<div key={i} className="w-1/2 h-4 bg-gray-600 rounded" />
				))}
			</div>
		</aside>
	);
}
