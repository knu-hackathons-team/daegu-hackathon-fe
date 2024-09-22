import { useState, useEffect } from "react";
import axios from "axios";
import styled from "@emotion/styled";
import {
  Box,
  Input,
  Button,
  Text,
  VStack,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";

// 과목 타입 정의
interface CourseType {
  name: string;
  location: string;
  code: string;
  startHour: number; // 시작 시간 (예: 9.5는 9시 30분)
  finalHour: number; // 종료 시간
  color: string; // 배경색을 위한 색상
  partial?: "top" | "bottom" | "full"; // 반틈만 색칠될 때를 위한 속성
}

// 랜덤 색상 생성 함수
const getRandomColor = (): string => {
  const colors = [
    "#FFCDD2",
    "#F8BBD0",
    "#E1BEE7",
    "#D1C4E9",
    "#C5CAE9",
    "#BBDEFB",
    "#B3E5FC",
    "#B2EBF2",
    "#B2DFDB",
    "#C8E6C9",
    "#DCEDC8",
    "#F0F4C3",
    "#FFF9C4",
    "#FFECB3",
    "#FFE0B2",
    "#FFCCBC",
    "#D7CCC8",
    "#CFD8DC",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// 6시부터 21시까지 (1시간 단위)
const timetableStructure = Array.from({ length: 10 }, (_, i) => ({
  time: `${i + 9}시`,
  mon: null as CourseType | null,
  tue: null as CourseType | null,
  wed: null as CourseType | null,
  thu: null as CourseType | null,
  fri: null as CourseType | null,
}));

export const Contents = () => {
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [timetable, setTimetable] = useState(timetableStructure);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState<CourseType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [courseToDelete, setCourseToDelete] = useState<CourseType | null>(null);
  const [dayToDelete, setDayToDelete] = useState<
    "mon" | "tue" | "wed" | "thu" | "fri" | null
  >(null);
  const [hourToDelete, setHourToDelete] = useState<number | null>(null);

  const nickname = localStorage.getItem("nickname");

  const openModal = (day: string) => {
    setSelectedDay(day);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 서버로부터 과목 데이터를 받아오는 함수
  useEffect(() => {
    const fetchData = async () => {
      const kakaoToken = localStorage.getItem("kakaoToken"); // 로컬 스토리지에서 토큰 가져오기

      try {
        const response = await axios.get(
          "https://giftshop-kakao.shop/api/subject",
        );

        const data = response.data.subjects.map((subject: any) => ({
          ...subject,
          color: getRandomColor(), // 랜덤 색상 추가
        }));
        setCourses(data); // 받아온 과목 데이터를 상태에 저장
      } catch (error) {
        console.error("과목 데이터를 받아오는 중 오류가 발생했습니다.", error);
      }
    };

    fetchData();
  }, []);

  // getSlotStyle 함수 추가
  const getSlotStyle = (course: CourseType, hour: number) => {
    const partial = course.partial; // 'partial' 속성으로 절반 색칠 여부 결정
    if (partial === "bottom") {
      return {
        height: "50%",
        backgroundColor: course.color,
        alignSelf: "flex-end",
      }; // 시작 시간이 30분일 때 절반 칸
    } else if (partial === "top") {
      return { height: "50%", backgroundColor: course.color }; // 종료 시간이 30분일 때 절반 칸
    } else if (partial === "full") {
      return { height: "100%", backgroundColor: course.color }; // 전체 칸 채우기
    } else {
      return { height: "0%", backgroundColor: "transparent" }; // 색칠 안함
    }
  };

  // 과목 검색 기능
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    const searchResults = courses.filter((course: CourseType) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(searchResults); // 검색 결과 업데이트
  };

  // 시간표에 과목 추가하는 함수
  const addCourseToTimetable = (
    course: CourseType,
    day: "mon" | "tue" | "wed" | "thu" | "fri"
  ) => {
    setTimetable((prev) => {
      const newTimetable = [...prev];
      const startSlot = Math.floor(course.startHour) - 6; // 시간표는 6시부터 시작
      const endSlot = Math.ceil(course.finalHour) - 6;

      // 과목이 추가될 시간이 이미 채워져 있는지 확인
      for (let slotIndex = startSlot; slotIndex < endSlot; slotIndex++) {
        if (slotIndex >= 0 && slotIndex < newTimetable.length) {
          const timeSlot = newTimetable[slotIndex];
          if (timeSlot[day] !== null) {
            // 해당 칸이 비어있지 않으면 추가되지 않음
            alert("해당 시간에 이미 다른 과목이 있습니다.");
            return prev; // 상태 변경하지 않고 기존 상태 반환
          }
        }
      }

      // 해당 시간이 비어있는 경우에만 과목 추가
      for (let slotIndex = startSlot; slotIndex < endSlot; slotIndex++) {
        if (slotIndex >= 0 && slotIndex < newTimetable.length) {
          const timeSlot = newTimetable[slotIndex];
          if (slotIndex === startSlot && course.startHour % 1 !== 0) {
            timeSlot[day] = { ...course, partial: "bottom" }; // 시작 시간이 30분일 때
          } else if (slotIndex === endSlot - 1 && course.finalHour % 1 !== 0) {
            timeSlot[day] = { ...course, partial: "top" }; // 종료 시간이 30분일 때
          } else {
            timeSlot[day] = { ...course, partial: "full" }; // 전체 칸 채우기
          }
        }
      }

      return newTimetable;
    });
  };

  // 시간표에서 과목을 삭제하는 함수
  const removeCourseFromTimetable = (
    day: "mon" | "tue" | "wed" | "thu" | "fri",
    hour: number
  ) => {
    setTimetable((prev) => {
      const newTimetable = [...prev];
      const slotIndex = hour - 6;
      if (slotIndex >= 0 && slotIndex < newTimetable.length) {
        newTimetable[slotIndex][day] = null; // 해당 시간대의 과목을 삭제
      }
      return newTimetable;
    });
  };

  // 과목을 클릭하여 삭제 모달을 여는 함수
  const handleCourseClick = (
    course: CourseType,
    day: "mon" | "tue" | "wed" | "thu" | "fri",
    hour: number
  ) => {
    setCourseToDelete(course);
    setDayToDelete(day);
    setHourToDelete(hour);
    setIsDeleteModalOpen(true);
  };

  // 모달에서 삭제를 확인하는 함수
  const confirmDeleteCourse = () => {
    if (courseToDelete && dayToDelete && hourToDelete !== null) {
      removeCourseFromTimetable(dayToDelete, hourToDelete);
      setIsDeleteModalOpen(false);
      setCourseToDelete(null);
      setDayToDelete(null);
      setHourToDelete(null);
    }
  };

  return (
    <Box bg="white" height="100vh" marginBottom="-59.5px">
      <Box bg="gray.100" p={5} borderRadius="md">
        <Input
          placeholder="과목명 검색"
          value={searchTerm}
          onChange={handleSearch}
          bg="white"
        />
        {searchTerm && (
          <VStack
            align="stretch"
            mt={2}
            spacing={2}
            height={`${Math.min(filteredCourses.length, 5) * 50}px`}
          >
            {filteredCourses.slice(0, 5).map((course, index) => (
              <HStack
                key={index}
                justify="space-between"
                bg="gray.200"
                p={2}
                borderRadius="md"
              >
                <Box>
                  <strong>{course.name}</strong>
                  <br />
                  <small>{course.location}</small>
                </Box>
                <Button
                  size="sm"
                  onClick={() => addCourseToTimetable(course, "mon")}
                >
                  추가
                </Button>
              </HStack>
            ))}
          </VStack>
        )}
      </Box>

      <TimetableWrapper>
        <Header>
          <Text>{nickname}님의 시간표</Text>
          <GridHeader>
            <div></div>
            <div>월</div>
            <div>화</div>
            <div>수</div>
            <div>목</div>
            <div>금</div>
          </GridHeader>
          <TimetableGrid>
            {timetable.map((slot, index) => (
              <>
                <TimeSlot key={`time-${index}`}>{slot.time}</TimeSlot>
                <DaySlot
                  onClick={() =>
                    slot.mon && handleCourseClick(slot.mon, "mon", index + 6)
                  }
                >
                  {slot.mon && (
                    <Course
                      style={getSlotStyle(slot.mon, index + 6)}
                      course={slot.mon}
                    />
                  )}
                </DaySlot>
                <DaySlot
                  onClick={() =>
                    slot.tue && handleCourseClick(slot.tue, "tue", index + 6)
                  }
                >
                  {slot.tue && (
                    <Course
                      style={getSlotStyle(slot.tue, index + 6)}
                      course={slot.tue}
                    />
                  )}
                </DaySlot>
                <DaySlot
                  onClick={() =>
                    slot.wed && handleCourseClick(slot.wed, "wed", index + 6)
                  }
                >
                  {slot.wed && (
                    <Course
                      style={getSlotStyle(slot.wed, index + 6)}
                      course={slot.wed}
                    />
                  )}
                </DaySlot>
                <DaySlot
                  onClick={() =>
                    slot.thu && handleCourseClick(slot.thu, "thu", index + 6)
                  }
                >
                  {slot.thu && (
                    <Course
                      style={getSlotStyle(slot.thu, index + 6)}
                      course={slot.thu}
                    />
                  )}
                </DaySlot>
                <DaySlot
                  onClick={() =>
                    slot.fri && handleCourseClick(slot.fri, "fri", index + 6)
                  }
                >
                  {slot.fri && (
                    <Course
                      style={getSlotStyle(slot.fri, index + 6)}
                      course={slot.fri}
                    />
                  )}
                </DaySlot>
              </>
            ))}
          </TimetableGrid>
        </Header>
      </TimetableWrapper>

      {/* 삭제 모달 */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>과목 삭제</ModalHeader>
          <ModalBody>이 과목을 삭제하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={confirmDeleteCourse}>
              삭제
            </Button>
            <Button ml={3} onClick={() => setIsDeleteModalOpen(false)}>
              아니요
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

// 과목 컴포넌트
const Course = ({
  course,
  style,
}: {
  course: CourseType;
  style: React.CSSProperties;
}) => (
  <CourseBox style={style}>
    {course.partial === "full" && (
      <>
        <Text fontSize="sm" fontWeight="bold">
          {course.name}
        </Text>
        <Text fontSize="xs">{course.location}</Text>
      </>
    )}
  </CourseBox>
);

const TimetableWrapper = styled.div`
  width: 100%;
  background-color: white;
  padding: 15px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 10px;
`;

const GridHeader = styled.div`
  display: grid;
  grid-template-columns: 70px repeat(5, 1fr); /* 시간 칸 하나와 요일 5개 */
  padding: 10px;
  font-weight: bold;
  text-align: center;
`;

const TimetableGrid = styled.div`
  display: grid;
  grid-template-columns: 70px repeat(5, 1fr); /* 시간 칸 하나와 요일 5개 */
  grid-auto-rows: 50px; /* 각 시간 칸 높이 설정 */
  gap: 1px; /* 칸 사이의 간격 */
`;

const TimeSlot = styled.div`
  background-color: #f0f0f0;
  text-align: center;
  padding: 10px;
  border: 1px solid #ccc;
`;

const DaySlot = styled.div`
  background-color: white;
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
  cursor: pointer; /* 클릭 가능하다는 표시 */
`;

const CourseBox = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  padding: 5px;
  text-align: center;
  box-sizing: border-box;
`;