/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { Button, Tooltip } from "@chakra-ui/react";
import { FiCompass } from "react-icons/fi"; // 나침반 아이콘
import { useEffect, useState, useRef, useCallback } from "react";

// Tmapv2 네임스페이스를 선언
declare global {
  interface Window {
    Tmapv2: any;
  }
}

const TMapPedestrianRoute = () => {
  const [centerCoords, setCenterCoords] = useState({
    lat: 35.88906978526561,
    lng: 128.61095680831664,
  });
  const [startPoint, setStartPoint] = useState<any>(null);
  const [endPoint, setEndPoint] = useState<any>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false); // 모달 상태 추가
  const mapRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);
  const startMarkerRef = useRef<any>(null);
  const endMarkerRef = useRef<any>(null);

  useEffect(() => {
    if (window.Tmapv2 && !mapRef.current) {
      const map = new window.Tmapv2.Map("map_div", {
        center: new window.Tmapv2.LatLng(centerCoords.lat, centerCoords.lng),
        zoom: 17,
        width: "100%",
        height: "100vh",
      });

      mapRef.current = map;

      map.addListener("drag", () => {
        const center = map.getCenter();
        setCenterCoords({ lat: center.lat(), lng: center.lng() });
      });
    }
  }, [centerCoords.lat, centerCoords.lng]);

  const calculateShortestRoute = useCallback(async () => {
    if (!startPoint || !endPoint) return;

    const url = "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1";
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      appKey: "wPnLT4b0AWa0YBI8jsof74ewEVe5JXoUidYnvxXc",
    };

    const requestBody = new URLSearchParams({
      startX: startPoint.lng.toString(),
      startY: startPoint.lat.toString(),
      endX: endPoint.lng.toString(),
      endY: endPoint.lat.toString(),
      reqCoordType: "WGS84GEO",
      resCoordType: "WGS84GEO",
      startName: "출발지",
      endName: "도착지",
      searchOption: "0",
    });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: requestBody.toString(),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const coordinates = data.features
            .filter((feature: any) => feature.geometry.type === "LineString")
            .flatMap((feature: any) => feature.geometry.coordinates);

          if (polylineRef.current) {
            polylineRef.current.setMap(null);
          }

          const path = coordinates.map(
            (coord: any) => new window.Tmapv2.LatLng(coord[1], coord[0])
          );

          polylineRef.current = new window.Tmapv2.Polyline({
            path: path,
            strokeColor: "#FF0000",
            strokeWeight: 4,
            map: mapRef.current,
          });

          if (path.length > 0) {
            mapRef.current.setCenter(path[0]);
            mapRef.current.setZoom(17);
          }

          const totalDistance = data.features
            .filter((feature: any) => feature.properties.totalDistance)
            .map((feature: any) => feature.properties.totalDistance)[0];

          const totalTime = data.features
            .filter((feature: any) => feature.properties.totalTime)
            .map((feature: any) => feature.properties.totalTime)[0];

          if (totalDistance)
            setDistance(parseFloat((totalDistance / 1000).toFixed(2)));
          if (totalTime) setEstimatedTime(Math.ceil(totalTime / 60));
        } else {
          console.error("Error: No route found in the response.");
        }
      } else {
        console.error("Error fetching route:", response.status);
      }
    } catch (error) {
      console.error("Failed to calculate route", error);
    }
  }, [startPoint, endPoint]);

  useEffect(() => {
    if (startPoint && endPoint) {
      calculateShortestRoute();
    }
  }, [startPoint, endPoint, calculateShortestRoute]);

  const handleStartSelection = () => {
    setStartPoint(centerCoords);
    setDistance(null);
    setEstimatedTime(null);

    if (startMarkerRef.current) {
      startMarkerRef.current.setMap(null);
    }

    startMarkerRef.current = new window.Tmapv2.Marker({
      position: new window.Tmapv2.LatLng(centerCoords.lat, centerCoords.lng),
      icon: "https://img.icons8.com/emoji/48/000000/triangular-flag.png",
      map: mapRef.current,
    });
  };

  const handleEndSelection = () => {
    setEndPoint(centerCoords);

    if (endMarkerRef.current) {
      endMarkerRef.current.setMap(null);
    }

    endMarkerRef.current = new window.Tmapv2.Marker({
      position: new window.Tmapv2.LatLng(centerCoords.lat, centerCoords.lng),
      icon: "https://img.icons8.com/emoji/48/000000/triangular-flag.png",
      map: mapRef.current,
    });
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenterCoords({ lat: latitude, lng: longitude });

          mapRef.current.setCenter(
            new window.Tmapv2.LatLng(latitude, longitude)
          );

          setIsModalVisible(true);
          setTimeout(() => {
            setIsModalVisible(false);
          }, 1500);
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <Wrapper>
      <div id="map_div"></div>
      <CenterDot />

      {isModalVisible && <Modal>현재 사용자 위치로 커서를 이동합니다.</Modal>}

      <InfoBox>
        <p>위도: {centerCoords.lat.toFixed(6)}</p>
        <p>경도: {centerCoords.lng.toFixed(6)}</p>
        {distance && <p>거리: {distance} km</p>}
        {estimatedTime && <p>예상 이동시간: {estimatedTime * 1.5} 분</p>}
      </InfoBox>

      <LocationBox>
        <p>
          출발지:{" "}
          {startPoint
            ? `${startPoint.lat.toFixed(6)}, ${startPoint.lng.toFixed(6)}`
            : "미설정"}
        </p>
        <p>
          도착지:{" "}
          {endPoint
            ? `${endPoint.lat.toFixed(6)}, ${endPoint.lng.toFixed(6)}`
            : "미설정"}
        </p>
      </LocationBox>

      <Tooltip label="현재 위치로 이동" aria-label="현재 위치로 이동">
        <LocationButton onClick={handleGetCurrentLocation}>
          <FiCompass size={24} color="black" />
        </LocationButton>
      </Tooltip>

      <ButtonWrapper>
        <Button
          onClick={handleStartSelection}
          bg="blue.500"
          color="white"
          _hover={{ bg: "blue.600" }}
        >
          출발지 선택
        </Button>

        <Divider />

        <Button
          onClick={handleEndSelection}
          bg="green.500"
          color="white"
          _hover={{ bg: "green.600" }}
        >
          도착지 선택
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
};

export default TMapPedestrianRoute;

// 스타일 정의
const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  margin-bottom: -59.5px;
`;

const InfoBox = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: white;
  padding: 10px;
  border-radius: 8px;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
`;

const LocationBox = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: white;
  padding: 10px;
  border-radius: 8px;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
`;

const LocationButton = styled(Button)`
  position: absolute;
  top: 90px;
  left: 10px;
  background-color: #ee82ee;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  padding: 20px;
  &:hover {
    background-color: #ba55d3;
  }
`;

const Modal = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 20px;
  border-radius: 8px;
  z-index: 2000;
  opacity: 0;
  animation: fadeInOut 1.7s forwards;

  @keyframes fadeInOut {
    0% {
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    80% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;

const ButtonWrapper = styled.div`
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background-color: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

const Divider = styled.div`
  height: 30px;
  width: 2px;
  background-color: gray;
`;

const CenterDot = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 7px;
  height: 7px;
  background-color: red;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
`;
