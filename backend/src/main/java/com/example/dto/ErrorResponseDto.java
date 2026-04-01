package com.example.dto;

/**
 * HTTP 오류 응답(4xx/5xx)에 사용되는 표준 오류 응답 DTO
 *
 * @param error   오류 타입 (예외 클래스명, 예: "RetryExhaustedException")
 * @param message 오류 상세 메시지
 */
public record ErrorResponseDto(String error, String message) {}
