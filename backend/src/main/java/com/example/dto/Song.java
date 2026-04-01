package com.example.dto;

public class Song {
    private int id;
    private String title;
    private String singer;
    private String lyric;

    public Song(int id, String title, String singer, String lyric) {
        this.id = id;
        this.title = title;
        this.singer = singer;
        this.lyric = lyric;
    }

    public int getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getSinger() {
        return singer;
    }

    public String getLyric() {
        return lyric;
    }
}
