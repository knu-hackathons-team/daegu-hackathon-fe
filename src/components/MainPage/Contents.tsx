import { useState } from "react";
import styled from "@emotion/styled";
import { Box, Input, Button, Text, VStack, HStack } from "@chakra-ui/react";

// 과목 타입 정의
interface CourseType {
  name: string;
  location: string;
  code: string;
  startHour: number; // 시작 시간 (예: 9.5는 9시 30분)
  finalHour: number; // 종료 시간
  color: string; // 배경색을 위한 색상
}

// 랜덤 색상 생성 함수
const getRandomColor = (): string => {
  const colors = [
    "#FFCDD2", "#F8BBD0", "#E1BEE7", "#D1C4E9", "#C5CAE9", "#BBDEFB", "#B3E5FC", "#B2EBF2", "#B2DFDB", "#C8E6C9",
    "#DCEDC8", "#F0F4C3", "#FFF9C4", "#FFECB3", "#FFE0B2", "#FFCCBC", "#D7CCC8", "#CFD8DC"
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

// 초기 과목 정보 (예시)
const initialCourses: CourseType[] = [
  {
    name: "국어와 매체언어",
    location: "산격동 캠퍼스 인문대학101",
    code: "CLTR0001-001",
    startHour: 9.0,
    finalHour: 13.0,
    color: getRandomColor(),
  },
  {
    name: "고급 프로그래밍",
    location: "산격동 캠퍼스 IT대학201",
    code: "COMP2001-002",
    startHour: 10.0,
    finalHour: 12.0,
    color: getRandomColor(),
  },
  {
    name: "데이터베이스 개론",
    location: "산격동 캠퍼스 IT대학305",
    code: "COMP3001-003",
    startHour: 13.5, // 13시 30분
    finalHour: 16.0,
    color: getRandomColor(),
  },
];

export const Contents = () => {
  const [courses, setCourses] = useState<CourseType[]>(initialCourses); // 초기 과목 데이터
  const [timetable, setTimetable] = useState(timetableStructure);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState<CourseType[]>([]);

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
  const addCourseToTimetable = (course: CourseType, day: "mon" | "tue" | "wed" | "thu" | "fri") => {
    setTimetable((prev) => {
      const newTimetable = [...prev];
      const startSlot = Math.floor(course.startHour) - 6; // 시간표 시작이 6시
      const endSlot = Math.ceil(course.finalHour) - 6;

      for (let slotIndex = startSlot; slotIndex < endSlot; slotIndex++) {
        if (slotIndex >= 0 && slotIndex < newTimetable.length) {
          const timeSlot = newTimetable[slotIndex];
          // 처음 시작 시간과 마지막 시간을 위한 절반 칸 처리
          if (slotIndex === startSlot && course.startHour % 1 !== 0) {
            timeSlot[day] = { ...course, partial: "bottom" } as any;  // 시작 시간이 30분일 때
          } else if (slotIndex === endSlot - 1 && course.finalHour % 1 !== 0) {
            timeSlot[day] = { ...course, partial: "top" } as any; // 종료 시간이 30분일 때
          } else {
            timeSlot[day] = { ...course, partial: "full" } as any; // 전체 칸 채우기
          }
        }
      }

      return newTimetable;
    });
  };

  // 각 수업이 시간표에 어떻게 표시될지 결정하는 함수
  const getSlotStyle = (course: CourseType, hour: number) => {
    const partial = (course as any).partial; // 'partial'은 동적으로 추가된 속성이므로 타입을 any로 처리
    if (partial === "bottom") {
      return { height: "50%", backgroundColor: course.color, alignSelf: "flex-end" }; // 시작 시간의 절반만 색칠
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
        <VStack align="stretch" mt={2}>
          {filteredCourses.map((course, index) => (
            <HStack key={index} justify="space-between" bg="gray.200" p={2} borderRadius="md">
              <Box>
                <strong>{course.name}</strong>
                <br />
                <small>{course.location}</small>
              </Box>
              <Button size="sm" onClick={() => addCourseToTimetable(course, "mon")}>
                추가
              </Button>
            </HStack>
          ))}
        </VStack>
      </Box>

      <TimetableWrapper>
        <Header>
          <Text>시간표</Text>
          <GridHeader>
            <div></div> {/* 빈 칸 (시간 부분) */}
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
                <DaySlot>
                  {slot.mon && <Course style={getSlotStyle(slot.mon, index + 6)} {...slot.mon} />}
                </DaySlot>
                <DaySlot>
                  {slot.tue && <Course style={getSlotStyle(slot.tue, index + 6)} {...slot.tue} />}
                </DaySlot>
                <DaySlot>
                  {slot.wed && <Course style={getSlotStyle(slot.wed, index + 6)} {...slot.wed} />}
                </DaySlot>
                <DaySlot>
                  {slot.thu && <Course style={getSlotStyle(slot.thu, index + 6)} {...slot.thu} />}
                </DaySlot>
                <DaySlot>
                  {slot.fri && <Course style={getSlotStyle(slot.fri, index + 6)} {...slot.fri} />}
                </DaySlot>
              </>
            ))}
          </TimetableGrid>
        </Header>
      </TimetableWrapper>
    </Box>
  );
};

// 과목 컴포넌트
const Course = ({ name, location, style }: { name: string; location: string; style: React.CSSProperties }) => (
  <CourseBox style={style}>
    <Text fontSize="sm" fontWeight="bold">
      {name}
    </Text>
    <Text fontSize="xs">{location}</Text>
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
  grid-template-columns: 100px repeat(5, 1fr); /* 시간 칸 하나와 요일 5개 */
  padding: 10px;
  font-weight: bold;
  text-align: center;
`;

const TimetableGrid = styled.div`
  display: grid;
  grid-template-columns: 100px repeat(5, 1fr); /* 시간 칸 하나와 요일 5개 */
  grid-auto-rows: 80px; /* 각 시간 칸 높이 설정 */
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
