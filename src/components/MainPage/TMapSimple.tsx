/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import React, { useEffect, useRef, useState } from "react";

// Tmapv2 네임스페이스를 선언
declare global {
  interface Window {
    Tmapv2: any;
  }
}

const TMapSimple = () => {
  const [centerCoords] = useState({
    lat: 35.88906978526561, // 경북대학교 좌표
    lng: 128.61095680831664,
  });
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (window.Tmapv2 && !mapRef.current) {
      // Tmap 지도 생성
      const map = new window.Tmapv2.Map("map_div", {
        center: new window.Tmapv2.LatLng(centerCoords.lat, centerCoords.lng),
        zoom: 16,
        width: "100%",
        height: "100vh",
      });

      // 경북대학교 위치에 마커 표시
      new window.Tmapv2.Marker({
        position: new window.Tmapv2.LatLng(centerCoords.lat, centerCoords.lng),
        map: map,
      });

      mapRef.current = map;
    }
  }, [centerCoords]);

  return (
    <Wrapper>
      <div id="map_div" style={{ width: "100%", height: "100%" }}></div> {/* 지도 영역 */}
    </Wrapper>
  );
};

export default TMapSimple;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
