import { useState, useEffect, useRef } from 'react'

const BASE_URL = 'http://localhost:8080'

/**
 * SSE(Server-Sent Events) 연결 훅
 * EventSource로 서버에 연결하고 수신 데이터를 상태로 관리
 *
 * @param {string} path - SSE 엔드포인트 경로 (예: /api/karaoke/songs/1/lyrics/stream)
 * @param {string} eventName - 수신할 이벤트 이름 (예: lyric-char)
 * @param {boolean} enabled - 연결 활성화 여부
 */
export function useSSE(path, eventName, enabled = true) {
  const [items, setItems] = useState([])
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState(null)
  const esRef = useRef(null)

  useEffect(() => {
    if (!enabled) {
      if (esRef.current) {
        esRef.current.close()
        esRef.current = null
        setConnected(false)
      }
      return
    }

    const es = new EventSource(`${BASE_URL}${path}`)
    esRef.current = es

    es.addEventListener(eventName, (e) => {
      // 백엔드가 plain string으로 전송 (JSON 아님)
      setItems(prev => [...prev, e.data])
    })

    es.onopen = () => {
      setConnected(true)
      setError(null)
    }

    es.onerror = () => {
      setConnected(false)
      if (es.readyState === EventSource.CLOSED) {
        setError('SSE 연결 오류 - 서버가 실행 중인지 확인하세요')
      }
    }

    return () => {
      es.close()
      esRef.current = null
      setConnected(false)
    }
  }, [path, eventName, enabled])

  const clear = () => setItems([])

  return { items, connected, error, clear }
}