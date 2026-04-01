package com.example.service;

import com.example.dto.Song;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

/**
 * 현실 데이터 소스 시뮬레이션 서비스
 * 주식 시세(StockQuote)와 IoT 센서(SensorReading) 데이터를 Hot Publisher로 방출
 */
@Service
public class KaraokeStreamService {

    private static final Logger log = LoggerFactory.getLogger(KaraokeStreamService.class);
    private final List<String> songs = new ArrayList<>();
    private final List<Song> songList;

    public KaraokeStreamService() {
        songList = new ArrayList<>();
        songList.add(new Song(
                0, "사랑하게 될거야", "한로로", "https://image.bugsm.co.kr/album/images/500/205869/20586963.jpg",
                """
                영원을 꿈꾸던 널 떠나보내고 슬퍼하던 날까지도 떠나보냈네 
                오늘의 나에게 남아있는 건 피하지 못해 자라난 무던함뿐야 
                그곳의 나는 얼마만큼 울었는지 이곳의 나는 누구보다 잘 알기에 후회로 가득 채운 유리잔만 내려다보네 
                아 뭐가 그리 샘이 났길래 그토록 휘몰아쳤던가 
                그럼에도 불구하고 나는 너를 용서하고 사랑하게 될 거야 
                아파했지만 또 아파도 되는 기억 불안한 내게 모난 돌을 쥐여주던 
                깨진 조각 틈 새어 나온 눈물 터뜨려 보네 
                아 뭐가 그리 샘이 났길래 그토록 휘몰아쳤던가 
                그럼에도 불구하고 나는 너를 용서하고 사랑하게 될 거야 
                아 뭐가 그리 샘이 났길래 그토록 휘몰아쳤던가 
                그럼에도 불구하고 나는 너를 용서하고 사랑하게 될 거야 
                사랑하게 될 거야
                """));
    }

    public Flux<String> streamSongLyric(int id) {
        if (id < 0 || id >= songList.size()) {
            throw new RuntimeException("그런 노래 없음");
        }
        String song = songList.get(id).getLyric();

        return Flux.range(0, song.length())
                .map(index -> String.valueOf(song.charAt((index))))
                .doOnNext(s -> {
                    try {
                        Thread.sleep(500);
                    } catch (InterruptedException e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    public List<Song> getSongList() {
        return songList;
    }
}
