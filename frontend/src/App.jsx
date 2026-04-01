import { useState, useEffect } from "react";
import SongList from "./components/SongList";
import KaraokePlayer from "./components/KaraokePlayer";

// const SONGS = [
//   { id: 0, number: "001", title: "Bohemian Rhapsody", artist: "Queen" },
//   { id: 1, number: "002", title: "Never Gonna Give You Up", artist: "Rick Astley" },
//   { id: 2, number: "003", title: "Hotel California", artist: "Eagles" },
//   { id: 3, number: "004", title: "Shape of You", artist: "Ed Sheeran" },
//   { id: 4, number: "005", title: "Blinding Lights", artist: "The Weeknd" },
//   { id: 5, number: "006", title: "Dynamite", artist: "BTS" },
// ];

export default function App() {
  const [selectedSong, setSelectedSong] = useState(null);
  // 서버에서 받아올 노래 목록을 저장할 상태 (초기값은 빈 배열)
  const [songs, setSongs] = useState([]);
  // 로딩 상태 관리 (데이터를 받아오기 전까지 빈 화면이 뜨는 것을 방지)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 컴포넌트가 처음 렌더링될 때 Spring 서버로 GET 요청을 보냄
    fetch("http://localhost:8080/api/karaoke/songs")
      .then((response) => response.json())
      .then((data) => {
        // 백엔드 DTO(singer)와 프론트엔드 컴포넌트(artist)의 변수명 차이를 맞춰줌
        const formattedSongs = data.map((song) => ({
          ...song,
          artist: song.singer, // 기존 SongList 컴포넌트가 고장나지 않도록 추가
        }));
        setSongs(formattedSongs);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("노래 목록을 불러오는 중 에러 발생:", error);
        setIsLoading(false);
      });
  }, []); // 빈 배열을 넣어야 무한 반복 호출을 막고 딱 한 번만 실행됨

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0c0c0c",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Mono', 'Courier New', monospace",
      padding: "24px",
    }}>
      {/* 데이터가 로딩 중일 때 처리 */}
      {isLoading ? (
        <div style={{ color: "white", fontSize: "20px" }}>
          노래 목록을 불러오는 중입니다...
        </div>
      ) : selectedSong === null ? (
        <SongList songs={songs} onSelect={setSelectedSong} />
      ) : (
        <KaraokePlayer
          song={selectedSong}
          onBack={() => setSelectedSong(null)}
        />
      )}
    </div>
  );
}