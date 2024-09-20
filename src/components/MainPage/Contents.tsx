import { useState } from "react";
import styled from "@emotion/styled";
import { Box, Input, Button, Text, VStack, HStack } from "@chakra-ui/react";

// 과목 타입 정의
interface CourseType {
  name: string;
  location: string;
  color: string;
  startHour: number; // 시작 시간 (시간대 단위)
  duration: number; // 과목 길이 (15분 단위)
}

// 랜덤 색상 생성 함수
const getRandomColor = (): string => {
  const colors = [
    "#FFCDD2", "#F8BBD0", "#E1BEE7", "#D1C4E9", "#C5CAE9", "#BBDEFB", "#B3E5FC", "#B2EBF2", "#B2DFDB", "#C8E6C9", 
    "#DCEDC8", "#F0F4C3", "#FFF9C4", "#FFECB3", "#FFE0B2", "#FFCCBC", "#D7CCC8", "#CFD8DC"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// 6시부터 21시까지 (15분 단위로 4*16 = 64칸)
const timetableStructure = Array.from({ length: 64 }, (_, i) => ({
  time: `${Math.floor(i / 4) + 6}시 ${(i % 4) * 15}분`,
  mon: null as CourseType | null,
  tue: null as CourseType | null,
  wed: null as CourseType | null,
  thu: null as CourseType | null,
  fri: null as CourseType | null,
}));

export const Contents = () => {
  const [timetable, setTimetable] = useState(timetableStructure);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState<CourseType[]>([]);

  // 과목 추가 함수
  const addCourse = (
    day: "mon" | "tue" | "wed" | "thu" | "fri",
    course: CourseType
  ) => {
    setTimetable((prev) =>
      prev.map((slot, index) =>
        index >= (course.startHour - 6) * 4 &&
        index < (course.startHour - 6) * 4 + course.duration
          ? { ...slot, [day]: course }
          : slot
      )
    );
  };

  // 예시 과목 추가
  const handleAddCourse = () => {
    addCourse("mon", {
      name: "데이터베이스",
      location: "IT대학 225호",
      color: getRandomColor(),
      startHour: 9, // 9시에 시작
      duration: 4, // 1시간 수업
    });
  };

  // 과목 검색 기능
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    // 필터링 로직
    const searchResults = [
      {
        name: "데이터베이스",
        location: "IT대학 225호",
        color: getRandomColor(),
        startHour: 9,
        duration: 4,
      },
      {
        name: "알고리즘",
        location: "IT대학 101호",
        color: getRandomColor(),
        startHour: 13,
        duration: 4,
      },
    ].filter((course) => course.name.includes(searchTerm));

    setFilteredCourses(searchResults);
  };

  return (
    <Wrapper>
      <Box bg="gray.100" p={4} borderRadius="md">
        <Input
          placeholder="과목명 검색"
          value={searchTerm}
          onChange={handleSearch}
          bg="white"
        />
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
              <Button size="sm" onClick={() => addCourse("mon", course)}>
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
                  {slot.mon && <Course {...slot.mon} />}
                </DaySlot>
                <DaySlot>
                  {slot.tue && <Course {...slot.tue} />}
                </DaySlot>
                <DaySlot>
                  {slot.wed && <Course {...slot.wed} />}
                </DaySlot>
                <DaySlot>
                  {slot.thu && <Course {...slot.thu} />}
                </DaySlot>
                <DaySlot>
                  {slot.fri && <Course {...slot.fri} />}
                </DaySlot>
              </>
            ))}
          </TimetableGrid>
        </Header>
      </TimetableWrapper>
    </Wrapper>
  );
};

// 과목 컴포넌트
const Course = ({ name, location, color }: CourseType) => (
  <CourseBox bg={color}>
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
  grid-auto-rows: 60px; /* 각 시간 칸 높이 설정 */
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
  align-items: center;
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