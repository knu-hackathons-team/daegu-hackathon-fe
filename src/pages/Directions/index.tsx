import React, { useEffect, useState } from "react";

// Tmapv2 네임스페이스를 선언
declare global {
  interface Window {
    Tmapv2: any;
  }
}

const TMapPedestrianRoute = () => {
  const [routeData, setRouteData] = useState<any>(null);

  useEffect(() => {
    // 이제 스크립트 로드가 불필요하므로 바로 Tmapv2를 사용할 수 있음
    if (window.Tmapv2) {
      const map = new window.Tmapv2.Map("map_div", {
        center: new window.Tmapv2.LatLng(37.5665, 126.9780), // 초기 지도 중심 좌표
        width: "100%",
        height: "400px",
      });

      // 보행자 경로 데이터를 요청
      const getPedestrianRoute = async () => {
        const url = "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1";
        const headers = {
          "Content-Type": "application/x-www-form-urlencoded",
          appKey: "YOUR_TMAP_API_KEY", // 자신의 TMAP API 키를 넣으세요
        };

        const requestBody = new URLSearchParams({
          startX: "126.92365493654832", // 출발지 경도
          startY: "37.556770374096615", // 출발지 위도
          endX: "126.92432158129688", // 목적지 경도
          endY: "37.55279861528311", // 목적지 위도
          reqCoordType: "WGS84GEO", // 요청 좌표 타입
          resCoordType: "WGS84GEO", // 응답 좌표 타입
          startName: encodeURIComponent("출발지 명칭"), // 출발지 명칭
          endName: encodeURIComponent("목적지 명칭"), // 목적지 명칭
          searchOption: "0", // 경로 탐색 옵션
        });

        try {
          const response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: requestBody.toString(),
          });

          if (response.ok) {
            const data = await response.json();
            setRouteData(data); // 받은 데이터를 상태로 저장

            // 경로가 있으면 지도에 경로 그리기
            if (data.features && data.features.length > 0) {
              const coordinates = data.features
                .filter((feature: any) => feature.geometry.type === "LineString")
                .flatMap((feature: any) => feature.geometry.coordinates);

              // 좌표를 지도 위에 선으로 그리기
              const path = coordinates.map(
                (coord: any) => new window.Tmapv2.LatLng(coord[1], coord[0])
              );

              const polyline = new window.Tmapv2.Polyline({
                path: path,
                strokeColor: "#FF0000", // 경로 선의 색상 (빨간색)
                strokeWeight: 6, // 경로 선의 두께
                map: map,
              });

              // 경로의 첫 좌표를 중심으로 지도의 중심과 줌 레벨을 설정
              if (path.length > 0) {
                map.setCenter(path[0]);
                map.setZoom(15); // 적절한 줌 레벨 설정
              }
            }
          } else {
            console.error("Error fetching the route:", response.status);
          }
        } catch (error) {
          console.error("Request failed", error);
        }
      };

      getPedestrianRoute();
    } else {
      console.error("Tmapv2 is not defined");
    }
  }, []);

  return (
    <div>
      <h1>보행자 경로 안내</h1>
      <div id="map_div" style={{ width: "100%", height: "400px" }}></div>
      {routeData ? (
        <div>
          <h2>경로 데이터</h2>
          <pre>{JSON.stringify(routeData, null, 2)}</pre>
        </div>
      ) : (
        <p>경로 데이터를 불러오는 중...</p>
      )}
    </div>
  );
};

export default TMapPedestrianRoute;
