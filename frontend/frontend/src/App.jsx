import { useState } from "react";
import SongList from "./components/SongList";
import KaraokePlayer from "./components/KaraokePlayer";

const SONGS = [
  { id: 1, number: "001", title: "Bohemian Rhapsody", artist: "Queen" },
  { id: 2, number: "002", title: "Never Gonna Give You Up", artist: "Rick Astley" },
  { id: 3, number: "003", title: "Hotel California", artist: "Eagles" },
  { id: 4, number: "004", title: "Shape of You", artist: "Ed Sheeran" },
  { id: 5, number: "005", title: "Blinding Lights", artist: "The Weeknd" },
  { id: 6, number: "006", title: "Dynamite", artist: "BTS" },
];

export default function App() {
  const [selectedSong, setSelectedSong] = useState(null);

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
      {selectedSong === null ? (
        <SongList songs={SONGS} onSelect={setSelectedSong} />
      ) : (
        <KaraokePlayer
          song={selectedSong}
          onBack={() => setSelectedSong(null)}
        />
      )}
    </div>
  );
}