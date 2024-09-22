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
  const [isModalVisible, setIsModalVisible] = useState(false); // 나침반 모달
  const [selectionModalVisible, setSelectionModalVisible] = useState(true); // 초기 안내 모달 상태

  const mapRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);
  const startMarkerRef = useRef<any>(null);
  const endMarkerRef = useRef<any>(null);
  const startCircleRef = useRef<any>(null); // 출발지 원 참조
  const endCircleRef = useRef<any>(null); // 도착지 원 참조

  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.5); // 기본값 1.5

  useEffect(() => {
    const storedSpeed = localStorage.getItem("speed");
    if (storedSpeed) {
      setSpeedMultiplier(parseFloat(storedSpeed)); // localStorage에서 가져온 값을 숫자로 변환하여 설정
    }
  }, []);

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

            if (startCircleRef.current) {
              startCircleRef.current.setMap(null);
            }

            startCircleRef.current = new window.Tmapv2.Circle({
              center: path[0],
              radius: 4.5,
              strokeColor: "#FF0000",
              fillColor: "#FF0000",
              fillOpacity: 1,
              map: mapRef.current,
            });

            if (endCircleRef.current) {
              endCircleRef.current.setMap(null);
            }

            const lastCoord = path[path.length - 1];
            endCircleRef.current = new window.Tmapv2.Circle({
              center: lastCoord,
              radius: 4.5,
              strokeColor: "#FF0000",
              fillColor: "#FF0000",
              fillOpacity: 1,
              map: mapRef.current,
            });
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

  // POI 검색 함수 추가
  const getNearbyPOI = async (lat: number, lng: number) => {
    const url = `https://apis.openapi.sk.com/tmap/pois/search/around?version=1&centerLat=${lat}&centerLon=${lng}&radius=1&appKey=wPnLT4b0AWa0YBI8jsof74ewEVe5JXoUidYnvxXc`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.searchPoiInfo.pois.poi.length > 0) {
        return data.searchPoiInfo.pois.poi[0].name;
      } else {
        return "주변 건물 이름을 찾을 수 없음";
      }
    } catch (error) {
      console.error("Error fetching POI data:", error);
      return "getNearbyPOI 오류 발생";
    }
  };

  const getBuildingName = async (lat: number, lng: number) => {
    const url = `https://apis.openapi.sk.com/tmap/geo/reversegeocoding?version=1&lat=${lat}&lon=${lng}&coordType=WGS84GEO&addressType=A10&appKey=wPnLT4b0AWa0YBI8jsof74ewEVe5JXoUidYnvxXc`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.addressInfo) {
        return data.addressInfo.buildingName || data.addressInfo.fullAddress;
      } else {
        return "건물 이름을 찾을 수 없음";
      }
    } catch (error) {
      console.error("Error fetching building name:", error);
      return "getBuildingName 오류 발생";
    }
  };

  const handleStartSelection = async () => {
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

    let buildingName = await getNearbyPOI(centerCoords.lat, centerCoords.lng);

    if (!buildingName || buildingName === "주변 건물 이름을 찾을 수 없음") {
      buildingName = await getBuildingName(centerCoords.lat, centerCoords.lng);
    }

    setStartPoint((prev: any) => ({ ...prev, buildingName }));
  };

  const handleEndSelection = async () => {
    setEndPoint(centerCoords);

    if (endMarkerRef.current) {
      endMarkerRef.current.setMap(null);
    }

    endMarkerRef.current = new window.Tmapv2.Marker({
      position: new window.Tmapv2.LatLng(centerCoords.lat, centerCoords.lng),
      icon: "https://img.icons8.com/emoji/48/000000/triangular-flag.png",
      map: mapRef.current,
    });

    let buildingName = await getNearbyPOI(centerCoords.lat, centerCoords.lng);

    if (!buildingName || buildingName === "주변 건물 이름을 찾을 수 없음") {
      buildingName = await getBuildingName(centerCoords.lat, centerCoords.lng);
    }

    setEndPoint((prev: any) => ({ ...prev, buildingName }));
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

  const handleSendKakao = async () => {
    const kakaoToken = localStorage.getItem("kakaoToken"); 
    console.log(kakaoToken)
    const url = "https://giftshop-kakao.shop/api/timetable/kakao";

    if (!kakaoToken) {
      console.error("카카오 토큰이 없습니다.");
      return;
    }

    if (!startPoint || !endPoint || !estimatedTime || !distance) {
      console.error("모든 필드가 채워지지 않았습니다.");
      return;
    }

    const requestBody = {
      start: startPoint.buildingName || "미설정",
      end: endPoint.buildingName || "미설정",
      estimatedTime: estimatedTime * speedMultiplier,
      buildingDistance: distance * 1000, // m 단위로 전송
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${kakaoToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        console.log("카톡 메시지 전송 성공");
      } else {
        console.error("카톡 메시지 전송 실패:", response.status);
      }
    } catch (error) {
      console.error("카톡 메시지 전송 중 오류 발생:", error);
    }
  };

  return (
    <Wrapper>
      <div id="map_div"></div>
      <CenterDot />
      <LocationBox>
        <p>
          출발지: {startPoint ? startPoint.buildingName || "미설정" : "미설정"}
        </p>
        <p>도착지: {endPoint ? endPoint.buildingName || "미설정" : "미설정"}</p>
        {distance && <p>거리: {distance * 1000} m</p>}
        {estimatedTime && (
          <p>예상 이동시간: {estimatedTime * speedMultiplier} 분</p>
        )}
        <p>
          현재 속도:
          {speedMultiplier === 2.0
            ? " 느림"
            : speedMultiplier === 1.5
            ? " 보통"
            : speedMultiplier === 1.2
            ? " 빠름"
            : " 알 수 없음"}
        </p>
      </LocationBox>
      <ButtonWrapper>
        <Tooltip
          label="현재 위치로 이동"
          aria-label="현재 위치로 이동"
          placement="top"
        >
          <LocationButton onClick={handleGetCurrentLocation}>
            <FiCompass size={24} color="white" />
          </LocationButton>
        </Tooltip>
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

      <SendKakaoButton onClick={handleSendKakao}>카톡전송</SendKakaoButton>
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
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #666666;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  padding: 22px;
  &:hover {
    background-color: #999999; /* 더 짙은 회색으로 hover 효과 */
  }
`;

const ButtonWrapper = styled.div`
  position: absolute;
  bottom: 110px;
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

const SendKakaoButton = styled(Button)`
  position: absolute;
  right: 20px;
  bottom: 50%;
  transform: translateY(50%);
  background-color: #f9d54e;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  &:hover {
    background-color: #f2c30d;
  }
`;
