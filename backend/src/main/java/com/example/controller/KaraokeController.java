package com.example.controller;

import com.example.dto.Song;
import com.example.service.KaraokeStreamService;
import java.util.List;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/karaoke")
public class KaraokeController {

    private final KaraokeStreamService karaokeStreamService;

    public KaraokeController(KaraokeStreamService karaokeStreamService) {
        this.karaokeStreamService = karaokeStreamService;
    }

    @GetMapping(value = "/song/{id}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerSentEvent<String>> songStream(@PathVariable int id) {
        return karaokeStreamService.streamSongLyric(id)
                .map(s -> ServerSentEvent.<String>builder()
                        .event("lyric")
                        .data(s)
                        .build());
    }

    @GetMapping(value = "/songs")
    public ResponseEntity<List<Song>> getSongList() {
        List<Song> response = karaokeStreamService.getSongList();
        return ResponseEntity.ok(response);
    }
}
