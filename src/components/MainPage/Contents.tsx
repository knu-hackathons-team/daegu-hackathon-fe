import { useState, useEffect } from "react";
import axios from "axios";
import styled from "@emotion/styled";
import { Box, Input, Button, Text, VStack, HStack } from "@chakra-ui/react";
import ModalComponent from "./ModalComponent";

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
const timetableStructure = Array.from({ length: 16 }, (_, i) => ({
  time: `${i + 6}시`,
  mon: null as CourseType | null,
  tue: null as CourseType | null,
  wed: null as CourseType | null,
  thu: null as CourseType | null,
  fri: null as CourseType | null,
}));

export const Contents = () => {
  const [courses, setCourses] = useState<CourseType[]>([]); // 백엔드에서 받아올 과목 데이터
  const [timetable, setTimetable] = useState(timetableStructure);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState<CourseType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>("");

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
      try {
        const response = await axios.get(
          "http://13.124.25.138:8080/api/subject"
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
      const startSlot = Math.floor(course.startHour) - 6; // 시간표 시작이 6시
      const endSlot = Math.ceil(course.finalHour) - 6;

      for (let slotIndex = startSlot; slotIndex < endSlot; slotIndex++) {
        if (slotIndex >= 0 && slotIndex < newTimetable.length) {
          const timeSlot = newTimetable[slotIndex];
          // 처음 시작 시간과 마지막 시간을 위한 절반 칸 처리
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

  // 각 수업이 시간표에 어떻게 표시될지 결정하는 함수
  const getSlotStyle = (course: CourseType, hour: number) => {
    const partial = course.partial; // 'partial' 속성으로 절반 색칠 여부 결정
    if (partial === "bottom") {
      return {
        height: "50%",
        backgroundColor: course.color,
        alignSelf: "flex-end",
      }; // 시작 시간의 절반만 색칠
    } else if (partial === "top") {
      return { height: "50%", backgroundColor: course.color }; // 종료 시간의 절반만 색칠
    } else if (partial === "full") {
      return { height: "100%", backgroundColor: course.color }; // 전체 칸 색칠
    } else {
      return { height: "0%", backgroundColor: "transparent" }; // 색칠 안함
    }
  };

  return (
    <Box>
      <Box bg="gray.100" p={4} borderRadius="md">
        <Input
          placeholder="과목명 검색"
          value={searchTerm}
          onChange={handleSearch}
          bg="white"
        />
        {/* 검색어가 비어있지 않을 때만 VStack을 보여줌 */}
        {searchTerm && (
          <VStack align="stretch" mt={2}>
            {filteredCourses.map((course, index) => (
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
          <Text>00님의 시간표</Text>
          <GridHeader>
            <div></div> {/* 빈 칸 (시간 부분) */}
            <div onClick={() => openModal("월")}>월</div>
            <div onClick={() => openModal("화")}>화</div>
            <div onClick={() => openModal("수")}>수</div>
            <div onClick={() => openModal("목")}>목</div>
            <div onClick={() => openModal("금")}>금</div>
          </GridHeader>
          <TimetableGrid>
            {timetable.map((slot, index) => (
              <>
                <TimeSlot key={`time-${index}`}>{slot.time}</TimeSlot>
                <DaySlot>
                  {slot.mon && (
                    <Course
                      style={getSlotStyle(slot.mon, index + 6)}
                      course={slot.mon}
                    />
                  )}
                </DaySlot>
                <DaySlot>
                  {slot.tue && (
                    <Course
                      style={getSlotStyle(slot.tue, index + 6)}
                      course={slot.tue}
                    />
                  )}
                </DaySlot>
                <DaySlot>
                  {slot.wed && (
                    <Course
                      style={getSlotStyle(slot.wed, index + 6)}
                      course={slot.wed}
                    />
                  )}
                </DaySlot>
                <DaySlot>
                  {slot.thu && (
                    <Course
                      style={getSlotStyle(slot.thu, index + 6)}
                      course={slot.thu}
                    />
                  )}
                </DaySlot>
                <DaySlot>
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
      <ModalComponent isOpen={isModalOpen} onClose={closeModal} selectedDay={selectedDay} />
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

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const TimetableWrapper = styled.div`
  width: 100%;
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
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
