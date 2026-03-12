'use client';

import { useState } from 'react';
import AdminHeader from '../../components/AdminHeader';
import QuestionManagement from './QuestionManagement';
import AttemptManagement from './AttemptManagement';

type TabType = 'questions' | 'attempts';

export default function LevelTestManagementPage() {
  const [activeTab, setActiveTab] = useState<TabType>('questions');

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <main className="max-w-[1920px] mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">레벨테스트 관리</h1>
          <p className="text-gray-600 mt-2">
            레벨테스트 문제를 관리하고 응시자의 시도를 채점할 수 있습니다.
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab('questions')}
              className={`pb-4 px-2 font-medium transition-colors relative ${
                activeTab === 'questions'
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              문제 관리
              {activeTab === 'questions' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('attempts')}
              className={`pb-4 px-2 font-medium transition-colors relative ${
                activeTab === 'attempts'
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              시도 관리 / 채점
              {activeTab === 'attempts' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          </nav>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="bg-white rounded-xl shadow-sm">
          {activeTab === 'questions' && <QuestionManagement />}
          {activeTab === 'attempts' && <AttemptManagement />}
        </div>
      </main>
    </div>
  );
}
