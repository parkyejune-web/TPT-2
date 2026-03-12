'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '../../components/AdminHeader';
import CustomModal from '../../components/CustomModal';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import {
  getTrainers,
  createTrainer,
  updateTrainer,
  deleteTrainer,
  getAssignedCustomers,
  type TrainerListItem,
  type TrainerRequestData,
  type AssignedCustomer,
} from '../../api/trainers';

export default function AssistantsPage() {
  const [trainers, setTrainers] = useState<TrainerListItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 모달 상태
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCustomersModal, setShowCustomersModal] = useState(false);

  // 선택된 트레이너
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerListItem | null>(null);

  // 배정 고객 목록
  const [assignedCustomers, setAssignedCustomers] = useState<AssignedCustomer[]>([]);

  // 폼 데이터
  const [formData, setFormData] = useState<TrainerRequestData>({
    name: '',
    phone: '',
    username: '',
    password: '',
    passwordCheck: '',
    onelineIntroduction: '',
    grantRole: 'ROLE_TRAINER',
  });

  // 프로필 이미지
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');

  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    setLoading(true);
    const response = await getTrainers();
    if (response.success && response.data) {
      setTrainers(response.data);
    } else {
      alert(`오류: ${response.error}`);
    }
    setLoading(false);
  };

  const handleCreateTrainer = async () => {
    // 유효성 검사
    if (!formData.name || !formData.phone || !formData.username || !formData.password) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    if (!formData.passwordCheck) {
      alert('비밀번호 확인을 입력해주세요.');
      return;
    }

    if (formData.password !== formData.passwordCheck) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!/^[0-9]{10,11}$/.test(formData.phone)) {
      alert('전화번호는 10-11자리 숫자만 입력해주세요.');
      return;
    }

    if (!formData.grantRole) {
      alert('권한을 선택해주세요.');
      return;
    }

    setLoading(true);
    const response = await createTrainer(formData, profileImage || undefined);

    if (response.success) {
      alert('트레이너가 등록되었습니다.');
      setShowCreateModal(false);
      resetForm();
      loadTrainers();
    } else {
      alert(`오류: ${response.error}`);
    }
    setLoading(false);
  };

  const handleUpdateTrainer = async () => {
    if (!selectedTrainer) return;

    // 유효성 검사
    if (!formData.name || !formData.phone || !formData.username) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    // 비밀번호를 입력한 경우에만 검증
    if (formData.password || formData.passwordCheck) {
      if (formData.password !== formData.passwordCheck) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }
    }

    if (!/^[0-9]{10,11}$/.test(formData.phone)) {
      alert('전화번호는 10-11자리 숫자만 입력해주세요.');
      return;
    }

    setLoading(true);
    const response = await updateTrainer(
      selectedTrainer.trainerId,
      formData,
      profileImage || undefined
    );

    if (response.success) {
      alert('트레이너 정보가 수정되었습니다.');
      setShowEditModal(false);
      resetForm();
      loadTrainers();
    } else {
      alert(`오류: ${response.error}`);
    }
    setLoading(false);
  };

  const handleDeleteTrainer = async (trainerId: number, name: string) => {
    if (!confirm(`${name} 트레이너를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    setLoading(true);
    const response = await deleteTrainer(trainerId);

    if (response.success) {
      alert('트레이너가 삭제되었습니다.');
      loadTrainers();
    } else {
      alert(`오류: ${response.error}`);
    }
    setLoading(false);
  };

  const handleShowCustomers = async (trainer: TrainerListItem) => {
    setSelectedTrainer(trainer);
    setLoading(true);

    const response = await getAssignedCustomers(trainer.trainerId);
    if (response.success && response.data) {
      setAssignedCustomers(response.data);
      setShowCustomersModal(true);
    } else {
      alert(`오류: ${response.error}`);
    }
    setLoading(false);
  };

  const openCreateModal = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const openEditModal = (trainer: TrainerListItem) => {
    setSelectedTrainer(trainer);
    setFormData({
      name: trainer.name,
      phone: trainer.phone,
      username: trainer.username,
      password: '',
      passwordCheck: '',
      onelineIntroduction: trainer.onelineIntroduction || '',
      grantRole: (trainer.role as 'ROLE_ADMIN' | 'ROLE_TRAINER') || 'ROLE_TRAINER',
    });
    setProfileImagePreview(trainer.profileImageUrl || '');
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      username: '',
      password: '',
      passwordCheck: '',
      onelineIntroduction: '',
      grantRole: 'ROLE_TRAINER',
    });
    setProfileImage(null);
    setProfileImagePreview('');
    setSelectedTrainer(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    if (role === 'ROLE_ADMIN') return 'bg-purple-100 text-purple-800';
    if (role === 'ROLE_TRAINER') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getRoleLabel = (role: string) => {
    if (role === 'ROLE_ADMIN') return '관리자';
    if (role === 'ROLE_TRAINER') return '트레이너';
    return role;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <main className="max-w-[1920px] mx-auto px-6 py-8">
        {loading && (
          <div className="bg-white rounded-lg p-6 mb-4">
            <p className="text-lg font-medium">로딩 중...</p>
          </div>
        )}

        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">조교 관리</h1>
            <p className="text-gray-600 mt-2">트레이너 및 관리자 계정을 관리할 수 있습니다.</p>
          </div>
          <CustomButton variant="primary" onClick={openCreateModal}>
            + 트레이너 추가
          </CustomButton>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    프로필
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    성함
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    전화번호
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    아이디
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    한줄소개
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    권한
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {trainers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      등록된 트레이너가 없습니다.
                    </td>
                  </tr>
                ) : (
                  trainers.map((trainer) => (
                    <tr key={trainer.trainerId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {trainer.profileImageUrl ? (
                          <img
                            src={trainer.profileImageUrl}
                            alt={trainer.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-sm">{trainer.name[0]}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {trainer.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {trainer.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {trainer.username}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="max-w-xs truncate">
                          {trainer.onelineIntroduction || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(
                            trainer.role
                          )}`}
                        >
                          {getRoleLabel(trainer.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => openEditModal(trainer)}
                          className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        >
                          수정
                        </button>
                        {trainer.role === 'ROLE_TRAINER' && (
                          <button
                            onClick={() => handleShowCustomers(trainer)}
                            className="text-green-600 hover:text-green-800 font-medium transition-colors"
                          >
                            배정고객
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteTrainer(trainer.trainerId, trainer.name)}
                          className="text-red-600 hover:text-red-800 font-medium transition-colors"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* 트레이너 추가 모달 */}
      {showCreateModal && (
        <CustomModal title="트레이너 추가" onClose={() => setShowCreateModal(false)}>
          <div className="space-y-4">
            {/* 프로필 이미지 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                프로필 이미지 (선택사항)
              </label>
              <div className="flex items-center space-x-4">
                {profileImagePreview ? (
                  <img
                    src={profileImagePreview}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">이미지</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-sm text-gray-600"
                />
              </div>
            </div>

            <CustomInput
              label="성함*"
              placeholder="이름을 입력하세요"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <CustomInput
              label="전화번호* (숫자만 10-11자리)"
              placeholder="01012345678"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />

            <CustomInput
              label="아이디*"
              placeholder="로그인 ID"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />

            <CustomInput
              type="password"
              label="비밀번호*"
              placeholder="비밀번호"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            <CustomInput
              type="password"
              label="비밀번호 확인*"
              placeholder="비밀번호 확인"
              value={formData.passwordCheck}
              onChange={(e) => setFormData({ ...formData, passwordCheck: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                한줄소개 (선택사항)
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="한줄소개를 입력하세요"
                value={formData.onelineIntroduction}
                onChange={(e) =>
                  setFormData({ ...formData, onelineIntroduction: e.target.value })
                }
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">권한*</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.grantRole}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    grantRole: e.target.value as 'ROLE_ADMIN' | 'ROLE_TRAINER',
                  })
                }
              >
                <option value="ROLE_TRAINER">트레이너</option>
                <option value="ROLE_ADMIN">관리자</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <CustomButton variant="secondary" onClick={() => setShowCreateModal(false)}>
                취소
              </CustomButton>
              <CustomButton variant="primary" onClick={handleCreateTrainer}>
                등록
              </CustomButton>
            </div>
          </div>
        </CustomModal>
      )}

      {/* 트레이너 수정 모달 */}
      {showEditModal && selectedTrainer && (
        <CustomModal title="트레이너 수정" onClose={() => setShowEditModal(false)}>
          <div className="space-y-4">
            {/* 프로필 이미지 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                프로필 이미지
              </label>
              <div className="flex items-center space-x-4">
                {profileImagePreview ? (
                  <img
                    src={profileImagePreview}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">이미지</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-sm text-gray-600"
                />
              </div>
            </div>

            <CustomInput
              label="성함*"
              placeholder="이름을 입력하세요"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <CustomInput
              label="전화번호* (숫자만 10-11자리)"
              placeholder="01012345678"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />

            <CustomInput
              label="아이디*"
              placeholder="로그인 ID"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />

            <CustomInput
              type="password"
              label="비밀번호 (변경시에만 입력)"
              placeholder="새 비밀번호"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />

            <CustomInput
              type="password"
              label="비밀번호 확인 (변경시에만 입력)"
              placeholder="새 비밀번호 확인"
              value={formData.passwordCheck}
              onChange={(e) => setFormData({ ...formData, passwordCheck: e.target.value })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                한줄소개
              </label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="한줄소개를 입력하세요"
                value={formData.onelineIntroduction}
                onChange={(e) =>
                  setFormData({ ...formData, onelineIntroduction: e.target.value })
                }
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">권한*</label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={formData.grantRole}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    grantRole: e.target.value as 'ROLE_ADMIN' | 'ROLE_TRAINER',
                  })
                }
              >
                <option value="ROLE_TRAINER">트레이너</option>
                <option value="ROLE_ADMIN">관리자</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <CustomButton variant="secondary" onClick={() => setShowEditModal(false)}>
                취소
              </CustomButton>
              <CustomButton variant="primary" onClick={handleUpdateTrainer}>
                수정
              </CustomButton>
            </div>
          </div>
        </CustomModal>
      )}

      {/* 배정 고객 목록 모달 */}
      {showCustomersModal && selectedTrainer && (
        <CustomModal title={`${selectedTrainer.name} - 배정 고객 목록`} onClose={() => setShowCustomersModal(false)}>
          <div className="space-y-2">
            {assignedCustomers.length === 0 ? (
              <p className="text-gray-500 text-center py-8">배정된 고객이 없습니다.</p>
            ) : (
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                {assignedCustomers.map((customer) => (
                  <div
                    key={customer.customerId}
                    className="p-4 flex justify-between items-center hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{customer.name}</p>
                      <p className="text-sm text-gray-500">ID: {customer.customerId}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CustomModal>
      )}
    </div>
  );
}
