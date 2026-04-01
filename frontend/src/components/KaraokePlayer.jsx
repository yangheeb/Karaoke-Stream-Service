import { useState, useEffect, useRef } from 'react'
import { useSSE } from '../hooks/useSSE'

const ACCENT = '#5a4fcf'

/**
 * 가라오케 플레이어 컴포넌트
 * 1) 카운트다운 3 → 2 → 1
 * 2) SSE로 글자 수신 → 현재 줄 조립 → 줄바꿈 이벤트 시 완성된 줄로 이동
 *
 * 백엔드 SSE 이벤트 형식:
 *   event: lyric-char
 *   data: { "character": "A", "isNewLine": false }
 *
 *   event: lyric-char
 *   data: { "character": "", "isNewLine": true }
 */
export default function KaraokePlayer({ song, onBack }) {
  const [phase, setPhase] = useState('countdown')  // 'countdown' | 'playing'
  const [count, setCount] = useState(3)

  const [completedLines, setCompletedLines] = useState([])
  const [currentChars, setCurrentChars]     = useState([])
  const lyricsEndRef = useRef(null)

  // useSSE: 재생 단계에서만 활성화
  const { items, connected, error } = useSSE(
    `/api/karaoke/song/${song.id}`,
    'lyric',
    phase === 'playing'
  )

  // ── 카운트다운 ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'countdown') return
    if (count === 0) { setPhase('playing'); return }
    const t = setTimeout(() => setCount(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, count])

  // ── SSE 수신 데이터 처리 ────────────────────────────────────────────────
  // useSSE의 items는 [...prev, data] 로 누적되므로
  // 마지막 아이템(= 방금 도착한 이벤트)만 처리한다
  const prevLengthRef = useRef(0)

  useEffect(() => {
    if (items.length === prevLengthRef.current) return
    prevLengthRef.current = items.length

    const char = items[items.length - 1]
    if (char === undefined) return

    if (char === '\n') {
      // 줄바꿈 문자: 현재 글자 배열 → 완성된 줄로 이동
      setCurrentChars(prev => {
        const line = prev.join('')
        setCompletedLines(lines => [...lines, line])
        return []
      })
    } else {
      // 일반 글자: 현재 줄에 추가
      setCurrentChars(prev => [...prev, char])
    }
  }, [items])

  // 새 데이터마다 스크롤 하단 유지
  useEffect(() => {
    lyricsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [completedLines, currentChars])

  // ── 카운트다운 화면 ─────────────────────────────────────────────────────
  if (phase === 'countdown') {
    return (
      <div style={{
        width: '100%',
        maxWidth: '480px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <p style={{ color: '#333', fontSize: '11px', letterSpacing: '3px', margin: '0 0 6px', textTransform: 'uppercase' }}>
          {song.number}
        </p>
        <p style={{ color: '#e8e8e8', fontSize: '22px', fontWeight: '500', margin: '0 0 4px', fontFamily: 'system-ui, sans-serif', textAlign: 'center' }}>
          {song.title}
        </p>
        <p style={{ color: '#555', fontSize: '14px', margin: '0 0 48px', fontFamily: 'system-ui, sans-serif' }}>
          {song.artist}
        </p>

        {/* 카운트 원 */}
        <div style={{
          width: '160px', height: '160px', borderRadius: '50%',
          border: `1.5px solid ${count > 0 ? '#2a2560' : '#222'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '24px', transition: 'border-color 0.3s',
        }}>
          <span style={{
            fontSize: '80px', fontWeight: '500', lineHeight: 1,
            color: count > 0 ? ACCENT : '#333',
            transition: 'color 0.3s',
          }}>
            {count > 0 ? count : '·'}
          </span>
        </div>

        <p style={{ color: '#444', fontSize: '12px', letterSpacing: '2px', margin: '0 0 20px' }}>
          시작까지
        </p>

        {/* 점 3개 */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {[3, 2, 1].map(n => (
            <div key={n} style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: count <= n && count > 0 ? ACCENT : '#222',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>

        <button onClick={onBack} style={btnStyle}>취소</button>
      </div>
    )
  }

  // ── 가사 재생 화면 ──────────────────────────────────────────────────────
  const currentLine = currentChars.join('')

  return (
    <div style={{ width: '100%', maxWidth: '720px' }}>
      {/* 상단 바 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <span style={{ color: '#333', fontSize: '11px', letterSpacing: '2px' }}>{song.number}&nbsp;&nbsp;</span>
          <span style={{ color: '#e0e0e0', fontSize: '15px', fontWeight: '500', fontFamily: 'system-ui, sans-serif' }}>{song.title}</span>
          <span style={{ color: '#555', fontSize: '13px', marginLeft: '8px', fontFamily: 'system-ui, sans-serif' }}>— {song.artist}</span>
        </div>

        {/* 연결 상태 표시 */}
        <div style={{ fontSize: '11px', color: error ? '#e24b4a' : connected ? ACCENT : '#555', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: error ? '#e24b4a' : connected ? ACCENT : '#555',
            display: 'inline-block',
            animation: connected ? 'pulse 1.4s ease-in-out infinite' : 'none',
          }} />
          {error ? '연결 오류' : connected ? '재생 중' : '연결 중...'}
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div style={{
          background: '#1a0a0a', border: '0.5px solid #3a1a1a',
          borderRadius: '8px', padding: '12px 16px',
          color: '#e24b4a', fontSize: '13px', marginBottom: '16px',
          fontFamily: 'system-ui, sans-serif',
        }}>
          {error}
        </div>
      )}

      {/* 가사 영역 */}
      <div style={{
        background: '#111', borderRadius: '16px',
        padding: '32px', minHeight: '320px', maxHeight: '400px',
        overflowY: 'auto', display: 'flex', flexDirection: 'column',
        gap: '14px', scrollbarWidth: 'none',
      }}>
        {/* 완성된 줄 (흐리게) */}
        {completedLines.map((line, i) => (
          <p key={i} style={{
            margin: 0, color: '#383838', fontSize: '18px',
            fontFamily: 'system-ui, sans-serif', lineHeight: '1.5',
          }}>
            {line}
          </p>
        ))}

        {/* 현재 조립 중인 줄 (강조) */}
        <p style={{
          margin: 0, color: '#f0f0f0', fontSize: '24px', fontWeight: '500',
          fontFamily: 'system-ui, sans-serif', lineHeight: '1.5',
          borderLeft: `3px solid ${ACCENT}`, paddingLeft: '16px', minHeight: '36px',
        }}>
          {currentLine}
          <span style={{
            display: 'inline-block', width: '2px', height: '22px',
            background: ACCENT, marginLeft: '2px', verticalAlign: 'middle',
            animation: 'blink 0.8s step-end infinite',
          }} />
        </p>

        <div ref={lyricsEndRef} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
        <button onClick={onBack} style={btnStyle}>목록으로</button>
      </div>

      <style>{`
        @keyframes blink  { 50% { opacity: 0; } }
        @keyframes pulse  { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
      `}</style>
    </div>
  )
}

const btnStyle = {
  marginTop: '40px',
  background: 'transparent',
  border: '0.5px solid #222',
  color: '#444',
  fontSize: '12px',
  padding: '8px 20px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontFamily: 'inherit',
}