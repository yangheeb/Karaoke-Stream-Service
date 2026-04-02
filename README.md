# Karaoke Stream Service

Spring WebFlux(Reactive Stream) 기반 가라오케 가사 스트리밍 서비스입니다.
노래 가사를 글자 단위로 SSE(Server-Sent Events)를 통해 실시간 전송하고, React 프론트엔드에서 노래방 화면처럼 렌더링합니다.

---

## 기술 스택

| 영역 | 기술 |
|---|---|
| Backend | Java 17, Spring Boot 4.1.3, Spring WebFlux, Project Reactor |
| Frontend | React 18, Vite |

---

## 실행 방법

**백엔드**
```bash
cd backend
./gradlew bootRun
```
서버 주소: `http://localhost:8080`

**프론트엔드**
```bash
cd frontend
npm install
npm run dev
```
개발 서버: `http://localhost:5173`

> 백엔드가 먼저 실행되어 있어야 합니다.

---

## API 명세

### 곡 목록 조회

```
GET /api/karaoke/songs
```

**Response**
```json
[
  { "id": 0, "title": "사랑하게 될거야", "artist": "한로로",   "lyric": "..." },
  { "id": 1, "title": "BLUE",           "artist": "빅뱅",     "lyric": "..." },
  { "id": 2, "title": "알록달록",        "artist": "잔나비",   "lyric": "..." },
  { "id": 3, "title": "Happy Day",      "artist": "체리필터", "lyric": "..." }
]
```

---

### 가사 스트리밍 (SSE)

```
GET /api/karaoke/song/{id}
Content-Type: text/event-stream
```

| 파라미터 | 타입 | 설명 |
|---|---|---|
| `id` | int | 곡 인덱스 (0부터 시작) |

**SSE 이벤트 형식**
```
event: lyric
data: 사

event: lyric
data: 랑
```

**글자 규칙**

| 수신 문자 | 처리 |
|---|---|
| 일반 문자 | 현재 줄에 이어 붙임 |
| `_` | 공백으로 치환하여 현재 줄에 추가 |
| `\n` | SSE 특성상 빈 문자열로 수신 → 현재 줄 완성 후 다음 줄 시작 |

**인터벌**: 글자당 200ms

---

## 화면 흐름

```
[SongList]  →  번호 클릭
    ↓
[KaraokePlayer - countdown]  →  3 → 2 → 1
    ↓
[KaraokePlayer - playing]  →  가사 실시간 렌더링
```

---

## 더미 데이터 곡 목록

| ID | 제목 | 아티스트 |
|---|---|---|
| 0 | 사랑하게 될거야 | 한로로 |
| 1 | BLUE | 빅뱅 |
| 2 | 알록달록 | 잔나비 |
| 3 | Happy Day | 체리필터 |
