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
                0, "사랑하게 될거야", "한로로",
                """
                        영원을_꿈꾸던_널_떠나보내고_슬퍼하던_날까지도_떠나보냈네_
                        오늘의_나에게_남아있는_건_피하지_못해_자라난_무던함뿐야_
                        그곳의_나는_얼마만큼_울었는지_이곳의_나는_누구보다_잘_알기에_후회로_가득_채운_유리잔만_내려다보네_
                        아_뭐가_그리_샘이_났길래_그토록_휘몰아쳤던가_
                        그럼에도_불구하고_나는_너를_용서하고_사랑하게_될_거야_
                        아파했지만_또_아파도_되는_기억_불안한_내게_모난_돌을_쥐여주던_
                        깨진_조각_틈_새어_나온_눈물_터뜨려_보네_
                        아_뭐가_그리_샘이_났길래_그토록_휘몰아쳤던가_
                        그럼에도_불구하고_나는_너를_용서하고_사랑하게_될_거야_
                        아_뭐가_그리_샘이_났길래_그토록_휘몰아쳤던가_
                        그럼에도_불구하고_나는_너를_용서하고_사랑하게_될_거야_
                        사랑하게_될_거야
                    """));
        songList.add(new Song(
                1, "BLUE", "빅뱅",
                """
                        겨울이_가고_봄이_찾아오죠
                        우린_시들고_그리움_속에_맘이_멍들었죠
                        I'm_singing_my_blues
                        파란_눈물에_파란_슬픔에_길들여져
                        I'm_singing_my_blues
                        뜬구름에_날려보낸_사랑_oh_oh
                        같은_하늘_다른_곳_너와_나
                        위험하니까_너에게서_떠나주는거야
                        님이란_글자에_점_하나
                        비겁하지만_내가_못나_숨는거야
                        잔인한_이별은_사랑의_말로
                        그_어떤_말도_위로될_순_없다고
                        아마_내_인생의_마지막_말로
                        막이_내려오네요_이제
                        태어나서_널_만나고
                        죽을만큼_사랑하고
                        파랗게_물들어_시린_내맘
                        눈을_감아도_널_느낄_수_없잖아
                        겨울이_가고_봄이_찾아오죠
                        우린_시들고_그리움_속에_맘이_멍들었죠
                        I'm_singing_my_blues
                        파란_눈물에_파란_슬픔에_길들여져
                        I'm_singing_my_blues
                        뜬구름에_날려보낸_사랑_oh_oh
                        심장이_멎은_것만_같아
                        전쟁이_끝나고_그곳에_얼어붙은_너와_나
                        내_머릿속_새겨진_트라우마
                        이_눈물_마르면_촉촉히_기억하리_내사랑
                        괴롭지도_외롭지도_않아
                        행복은_다_혼자만
                        그_이상의_복잡한_건_못_참아
                        대수롭지_아무렇지도_않아_별_수_없는_방황
                        사람들은_왔다_간다
                        태어나서_널_만나고
                        죽을만큼_사랑하고
                        파랗게_물들어_시린_내맘
                        너는_떠나도_난_그대로_있잖아
                        겨울이_가고_봄이_찾아오죠
                        우린_시들고_그리움_속에_맘이_멍들었죠
                        오늘도_파란_저_달빛_아래에
                        나홀로_잠이_들겠죠
                        꿈_속에서_떠난_그대를_찾아
                        헤매이며_이_노래를_불러요
                        I'm_singing_my_blues
                        파란_눈물에_파란_슬픔에_길들여져
                        I'm_singing_my_blues
                        뜬구름에_날려보낸_사랑
                        I'm_singing_my_blues
                        파란_눈물에_파란_슬픔에_길들여져
                        I'm_singing_my_blues
                        뜬구름에_날려보낸_사랑_oh_oh
                    """));
        songList.add(new Song(
                3, "알록달록", "잔나비",
                """
                        알록달록_입맞춤,_시시뻘건_춤사위
                        원하는걸_줄테니,_솔직한걸_말해줘
                        My_girl,_my_girl,_such_a_pretty_baby_(yeah)
                        솔직한걸_말해줘
                        늘_걷던_꿈길을_나와_함께_뒤척이면
                        Hold_me_now,_hold_me_tight,_don't_let_me_go
                        별_볼일_없었던_내_일요일_밤중에도
                        Love_me_now,_love_me_tight,_don't_let_me_go
                        Tell_me_what_you_gonna_do
                        나와_함께_해주오
                        Tell_me_what_you_wanna_do
                        모두_내게_말해줘,_oh,_oh
                        알록달록_입맞춤,_시시뻘건_춤사위
                        원하는걸_줄테니,_솔직한걸_말해줘
                        My_girl,_my_girl,_such_a_pretty_baby_(yeah)
                        솔직한걸_말해줘
                        My_girl,_my_girl,_such_a_pretty_baby_(yeah)
                        그대_날_알아주오,_내게_믿음을_주오
                        Hold_me_now,_hold_me_tight,_don't_let_me_go
                        거칠을_쇠소리에_내_귀를_닫아주오
                        Love_me_now,_love_me_tight,_don't_let_me_go
                        Tell_me_what_you_gonna_do
                        나와_함께_해주오
                        Tell_me_what_you_wanna_do
                        모두_내게_말해줘,_oh,_oh
                        알록달록_입맞춤,_시시뻘건_춤사위
                        원하는걸_줄테니,_솔직한걸_말해줘
                        My_girl,_my_girl,_such_a_pretty_baby_(yeah)
                        솔직한걸_말해줘
                        Oh,_yeah
                        My_girl,_my_girl,_such_a_pretty_baby_(oh,_yeah)
                        Such_a_pretty_baby_(yeah)
                        알,_알,_알,_알
                        알록달록_입맞춤,_시시뻘건_춤사위
                        원하는걸_줄테니,_솔직한걸_말해줘
                        My_girl,_my_girl,_such_a_pretty_baby_(yeah)
                        솔직한걸_말해줘
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
                        Thread.sleep(200);
                    } catch (InterruptedException e) {
                        throw new RuntimeException(e);
                    }
                });
    }

    public List<Song> getSongList() {
        return songList;
    }
}
