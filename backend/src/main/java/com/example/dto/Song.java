package com.example.dto;

public class Song {
    private int id;
    private String title;
    private String singer;
    private String imageUrl;
    private String lyric;

    public Song(int id, String title, String singer, String imageUrl, String lyric) {
        this.id = id;
        this.title = title;
        this.singer = singer;
        this.imageUrl = imageUrl;
        this.lyric = lyric;
    }
}
