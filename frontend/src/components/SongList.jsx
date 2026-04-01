import { useState } from 'react'

const ACCENT = '#5a4fcf'

export default function SongList({ songs, onSelect }) {
  const [hovered, setHovered] = useState(null)

  return (
    <div style={{ width: '100%', maxWidth: '720px' }}>
      {/* 헤더 */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{
          color: '#333',
          fontSize: '11px',
          letterSpacing: '3px',
          margin: '0 0 8px',
          textTransform: 'uppercase',
        }}>
          KARAOKE
        </p>
        <h1 style={{
          color: '#e8e8e8',
          fontSize: '28px',
          fontWeight: '500',
          margin: 0,
          letterSpacing: '-0.5px',
        }}>
          노래 선택
        </h1>
      </div>

      {/* 곡 목록 그리드 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
      }}>
        {songs.map((song) => (
          <div
            key={song.id}
            onClick={() => onSelect(song)}
            onMouseEnter={() => setHovered(song.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              background: hovered === song.id ? '#1c1c1c' : '#141414',
              border: `0.5px solid ${hovered === song.id ? '#3a3a3a' : '#222'}`,
              borderRadius: '12px',
              padding: '20px',
              cursor: 'pointer',
              transform: hovered === song.id ? 'translateY(-1px)' : 'none',
              transition: 'border-color 0.15s, background 0.15s, transform 0.1s',
            }}
          >
            {/* <p style={{
              fontSize: '20px',
              fontWeight: '500',
              color: ACCENT,
              margin: '0 0 10px',
              letterSpacing: '1px',
            }}>
              {song.number}
            </p> */}
            <p style={{
              fontSize: '14px',
              color: '#e0e0e0',
              fontWeight: '500',
              margin: '0 0 4px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontFamily: 'system-ui, sans-serif',
            }}>
              {song.title}
            </p>
            <p style={{
              fontSize: '12px',
              color: '#555',
              margin: 0,
              fontFamily: 'system-ui, sans-serif',
            }}>
              {song.artist}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}