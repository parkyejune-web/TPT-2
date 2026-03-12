"use client";

// 디자인 시스템 문서화 페이지입니다.
import Image from "next/image";
import React, { useState } from "react";
import AuthHeader from "../components/AuthHeader";
import CustomButton from "../components/CustomButton";
import { CustomDropdownButton } from "../components/CustomDropdown";
import { FixedModalButton } from "../components/FixedModalButton";
import CustomToggleButton from "../components/CustomToggleButton";
import NotionPageButton from "../components/NotionPageButton";
import { CustomLink } from "../components/CustomLink";
import CustomBox from "../components/CustomBox";
import CustomInputField from "../components/CustomInputField";
import CustomTextArea from "../components/CustomTextArea";
import CustomModal from "../components/CustomModal";
import CustomCheckBox from "../components/CustomCheckBox";
import CustomDivider from "../components/CustomDivider";
import CustomLoading from "../components/CustomLoading";
import CustomSkeleton from "../components/CustomSkeleton";

import { CustomTable } from "../components/CustomTable";

import { User } from "../types/user"; // user type 
import { TableColumn } from "../types/table"; // table type 

// 예시 입력값 검증 함수
const validateInput = (value: string) => {
	if (value.length < 3) {
		return "입력값은 최소 3자 이상이어야 합니다.";
	}
	return null;
};

export default function Home() {
	const [inputValue, setInputValue] = useState("");
	const [maxLength] = useState(20);
	const [modal1, setModal1] = useState(false);
	const [modal2, setModal2] = useState(false);
	const [modal3, setModal3] = useState(false);
	const [modal4, setModal4] = useState(false);
	const [isChecked, setIsChecked] = useState(false);
	const [isChecked2, setIsChecked2] = useState(false);
	const [isChecked3, setIsChecked3] = useState(false);
	const [loading, setLoading] = useState(false);
	const [selectedOption, setSelectedOption] = useState('');

	const handleChange = (value: string) => {
		setInputValue(value);
	};

	const handleButtonClick = () => {
		alert("버튼 클릭!");
	};

	const handleChangeLoading = () => {
		setLoading(!loading);
	};

	const handleSelectOption = (selectedValue: string) => {
		setSelectedOption(selectedValue);  // 선택된 값 업데이트
	};

	const handleButtonClick2 = (buttonText: string) => {
		alert(`클릭된 버튼: ${buttonText}`);
	};

	const openModal1 = () => { setModal1(true); };
	const closeModal1 = () => { setModal1(false); };
	const openModal2 = () => { setModal2(true); };
	const closeModal2 = () => { setModal2(false); };
	const openModal3 = () => { setModal3(true); };
	const closeModal3 = () => { setModal3(false); };
	const openModal4 = () => { setModal4(true); };
	const closeModal4 = () => { setModal4(false); };

	return (
		<div className="min-h-screen">
			<AuthHeader />
			<div className="pt-16 flex flex-col items-start justify-items-center gap-5 p-3">
				<div className="flex w-full align-center justify-center">
					<p className="text-blue-500 text-2xl"> TPT Design System - made by Nayeong.Lee</p>
				</div>
				<p className="text-blue-300"> 0. Color Palette </p>
				<div className="grid grid-cols-5 gap-4 mb-6">
					<div className="text-center">
						<p className="text-sm font-medium mb-2">Primary</p>
						<div className="flex flex-col gap-1">
							<div className="w-16 h-8 bg-primary-500 rounded" title="primary-500" />
							<div className="w-16 h-8 bg-primary-600 rounded" title="primary-600" />
							<div className="w-16 h-8 bg-primary-700 rounded" title="primary-700" />
						</div>
					</div>
					<div className="text-center">
						<p className="text-sm font-medium mb-2">Success</p>
						<div className="flex flex-col gap-1">
							<div className="w-16 h-8 bg-success-500 rounded" title="success-500" />
							<div className="w-16 h-8 bg-success-600 rounded" title="success-600" />
							<div className="w-16 h-8 bg-success-700 rounded" title="success-700" />
						</div>
					</div>
					<div className="text-center">
						<p className="text-sm font-medium mb-2">Warning</p>
						<div className="flex flex-col gap-1">
							<div className="w-16 h-8 bg-warning-500 rounded" title="warning-500" />
							<div className="w-16 h-8 bg-warning-600 rounded" title="warning-600" />
							<div className="w-16 h-8 bg-warning-700 rounded" title="warning-700" />
						</div>
					</div>
					<div className="text-center">
						<p className="text-sm font-medium mb-2">Error</p>
						<div className="flex flex-col gap-1">
							<div className="w-16 h-8 bg-error-500 rounded" title="error-500" />
							<div className="w-16 h-8 bg-error-600 rounded" title="error-600" />
							<div className="w-16 h-8 bg-error-700 rounded" title="error-700" />
						</div>
					</div>
					<div className="text-center">
						<p className="text-sm font-medium mb-2">Neutral</p>
						<div className="flex flex-col gap-1">
							<div className="w-16 h-8 bg-neutral-500 rounded" title="neutral-500" />
							<div className="w-16 h-8 bg-neutral-600 rounded" title="neutral-600" />
							<div className="w-16 h-8 bg-neutral-700 rounded" title="neutral-700" />
						</div>
					</div>
				</div>

				<p className="text-blue-300"> 1. CustomButton </p>
				<div className="flex align-center justify-center gap-1">
					<CustomButton variant="normalFull">
						normalFull
					</CustomButton>
					<CustomButton variant="normalClean">
						normalClean
					</CustomButton>
					<CustomButton variant="disable" disabled>
						disable
					</CustomButton>
					<CustomButton variant="disableSimple" disabled>
						disableSimple
					</CustomButton>
					<CustomButton variant="danger">
						danger
					</CustomButton>
				</div>
				<CustomButton variant="normalFull" width="responsive-width">
					normalFull (반응형 width)
				</CustomButton>
				<CustomButton variant="normalFull" textSize="responsive-text">
					normalFull (반응형 text)
				</CustomButton>

				<p className="text-blue-300"> 2. CustomDropdown </p>
				<CustomDropdownButton
					options={['Option 1', 'Option 2', 'Option 3']}
					defaultValue="Select an option"
					onSelect={handleSelectOption}  // 선택된 값 부모로 전달
				/>

				<p className="text-blue-300"> 2. FixedModalButton </p>
				<FixedModalButton
					options={['A', 'B', 'C']}
					defaultValue="선택해주세요."
					onSelect={handleSelectOption}  // 선택된 값 부모로 전달
				/>

				<p className="text-blue-300"> 2. CustomToggleButton </p>
				<CustomToggleButton text="Show More Information">
					<div>
						<h3>Toggle 버튼</h3>
						<p>가나다라마바사 아자차카타파하 가나다라마바사 아자차카타파하 </p>
					</div>
				</CustomToggleButton>

				<p className="text-blue-300"> 2. NotionPageButton </p>
				<NotionPageButton
					number={1}
					text="First Page"
					onClick={() => handleButtonClick2("First Page")}
				/>
				<NotionPageButton
					number={2}
					text="Second Page"
					onClick={() => handleButtonClick2("Second Page")}
				/>

				<p className="text-blue-300"> 2. CustomLink </p>
				<div className="flex align-center justify-center gap-1">
					<CustomLink href="/" variant="primary" color="green-500" fontSize="text-xl">
						Primary Link
					</CustomLink>
					<CustomLink href="/" variant="secondary" color="purple-500" fontSize="text-lg" underline={false}>
						Secondary Link (No Underline)
					</CustomLink>
					<CustomLink href="/" variant="danger" color="red-600" fontSize="text-sm">
						Danger Link
					</CustomLink>
				</div>

				<p className="text-blue-300"> 2. CustomBox </p>
				<div className="flex w-full align-center justify-center gap-3">
					<CustomBox
						// width="sm:w-1/2 md:w-full lg:w-1/3 xl:w-1/4"
						width="responsive-width"
						// padding="sm:p-4 md:p-6 lg:p-8"
						padding="responsive-padding"
						// margin="sm:m-2 md:m-4 lg:m-6 xl:m-8"
						bgColor="bg-gray-200"
						textColor="text-gray-800"
						textAlign="text-center"
						borderRadius="rounded-lg"
						hover="hover:bg-gray-300"
					>
						반응형 박스 컴포넌트
					</CustomBox>
					<CustomBox
						width="w-[5%]"
						height="h-[15vh]"
						bgColor="bg-gray-200"
						textColor="text-gray-800"
						textAlign="text-center"
						borderRadius="rounded-lg"
						// hover="hover:bg-gray-300"
						scrollX
						scrollY
					>
						scrolledBox, scrolledBox, scrolledBox, scrolledBox, scrolledBox, scrolledBox, scrolledBox, scrolledBox
					</CustomBox>
					<CustomBox variant="card" width="responsive-width">card (반응형)</CustomBox>
					<CustomBox variant="panel">panel</CustomBox>
				</div>

				<p className="text-blue-300"> 3. CustomInputField </p>
				<div className="flex align-center justify-center gap-1">
					<CustomInputField placeholder="v-0" value={inputValue} onChange={handleChange} variant={0} />
					<CustomInputField placeholder="v-1" value={inputValue} onChange={handleChange} variant={1}
						maxLength={maxLength} />
					<CustomInputField placeholder="v-2" value={inputValue} onChange={handleChange} variant={2}
						validate={validateInput} />
					<CustomInputField placeholder="v-3" value={inputValue} onChange={handleChange} variant={3}
						validate={validateInput}
						buttonLabel="인증"
						onButtonClick={handleButtonClick} />
				</div>

				<p className="text-blue-300"> 4. CustomTextArea </p>
				<div className="flex align-center justify-center gap-1">
					<CustomTextArea
						variant={0}
						value={inputValue}
						onChange={handleChange}
						placeholder="v-0"
					/>

					<CustomTextArea
						variant={1}
						value={inputValue}
						onChange={handleChange}
						placeholder="v-1"
						maxLength={maxLength}
					/>

					<CustomTextArea
						variant={1}
						value={inputValue}
						onChange={handleChange}
						placeholder="v-1 + validate"
						maxLength={maxLength}
						validate={validateInput}
					/>
				</div>

				<p className="text-blue-300"> 5. CustomModal </p>
				<div className="flex align-center justify-center gap-1">
					<CustomButton variant="normalFull" onClick={openModal1}>v-0</CustomButton>
					<CustomButton variant="normalFull" onClick={openModal2}>v-1</CustomButton>
					<CustomButton variant="normalFull" onClick={openModal3}>v-2</CustomButton>
					<CustomButton variant="normalFull" onClick={openModal4}>v-3</CustomButton>
				</div>
				{modal1 && (
					<CustomModal isOpen onClose={closeModal1} variant={0} />
				)}
				{modal2 && (
					<CustomModal isOpen onClose={closeModal2} variant={1} />
				)}
				{modal3 && (
					<CustomModal isOpen onClose={closeModal3} variant={2} />
				)}
				{modal4 && (
					<CustomModal isOpen onClose={closeModal4} variant={3} />
				)}

				<p className="text-blue-300"> 6. CustomCheckBox </p>
				<div className="flex align-center justify-center gap-1">
					<CustomCheckBox
						checked={isChecked}
						onChange={setIsChecked}
						label="소형 체크박스"
						size="sm"
					/>

					<CustomCheckBox
						checked={isChecked2}
						onChange={setIsChecked2}
						label="중간 체크박스"
						size="md"
					/>

					<CustomCheckBox
						checked={isChecked3}
						onChange={setIsChecked3}
						label="대형 체크박스"
						size="lg"
					/>
				</div>

				<p className="text-blue-300"> 7. CustomDivider </p>
				<CustomDivider />
				<div className="flex align-center justify-center gap-10">
					<CustomDivider variant="vertical" height="h-30" />
					<CustomDivider variant="vertical" height="h-30" bgColor="bg-red-300" />
					<CustomDivider variant="vertical" width="w-2" height="h-30" bgColor="bg-green-300" />
				</div>

				<p className="text-blue-300"> 8. CustomLoading </p>
				<CustomButton variant="normalFull" onClick={handleChangeLoading}>로딩 화면 보기</CustomButton>
				{loading && (
					<CustomLoading />
				)}

				<p className="text-blue-300"> 9. CustomSkeleton </p>

				<CustomSkeleton variant="rect" width="w-full" height="h-48" />
				<CustomSkeleton variant="text" repeat={3} />

				<p className="text-blue-300"> 10. CustomTable </p>
				{/* <CustomTable data={userData} columns={userColumns} /> */}

			</div>
		</div>
	);
}

// 별도 파일로 분리할 것 (table의 column명과 id를 정의하는 골격)
const userColumns: TableColumn<User>[] = [
	{
		header: '아이디',
		accessorKey: 'id',
	},
	{
		header: '이름',
		accessorKey: 'name',
	},
	{
		header: '이메일',
		accessorKey: 'email',
	},
	// {
	// 	header: 'Actions',
	// 	cell: ({ row }) => (
	// 		<button
	// 			className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
	// 			onClick={() => alert(`Editing user: ${row.original.id}`)}
	// 		>
	// 			Edit
	// 		</button>
	// 	),
	// },
];

