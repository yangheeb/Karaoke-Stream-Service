package com.example.exception;

import com.example.dto.ErrorResponseDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import reactor.core.Exceptions;

import java.util.concurrent.TimeoutException;

/**
 * 전역 예외 처리 핸들러
 * Reactive Streams 파이프라인에서 발생하는 주요 예외를 HTTP 응답으로 변환 수행
 *
 * <ul>
 *   <li>RetryExhaustedException → HTTP 500</li>
 *   <li>TimeoutException        → HTTP 408</li>
 *   <li>OverflowException       → HTTP 500</li>
 *   <li>IllegalArgumentException → HTTP 400</li>
 * </ul>
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * 타임아웃 예외 처리 - HTTP 408
     */
    @ExceptionHandler(TimeoutException.class)
    @ResponseStatus(HttpStatus.REQUEST_TIMEOUT)
    @ResponseBody
    public ErrorResponseDto handleTimeout(TimeoutException ex) {
        log.error("[ERROR] TimeoutException 발생: {}", ex.getMessage());
        return new ErrorResponseDto("TimeoutException", ex.getMessage());
    }

    /**
     * 잘못된 인자 예외 처리 - HTTP 400
     */
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public ErrorResponseDto handleIllegalArgument(IllegalArgumentException ex) {
        log.error("[ERROR] IllegalArgumentException 발생: {}", ex.getMessage());
        return new ErrorResponseDto("IllegalArgumentException", ex.getMessage());
    }

    /**
     * 일반 예외 처리 - HTTP 500
     * RetryExhaustedException(Reactor 래핑 예외) 및 OverflowException(IllegalStateException 서브클래스)도 여기서 처리
     */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public ErrorResponseDto handleGeneral(Exception ex) {
        // RetryExhaustedException 여부 확인 (Reactor의 래핑 예외)
        if (Exceptions.isRetryExhausted(ex)) {
            log.error("[ERROR] RetryExhaustedException 발생: {}", ex.getMessage());
            Throwable cause = ex.getCause();
            String message = cause != null ? cause.getMessage() : ex.getMessage();
            return new ErrorResponseDto("RetryExhaustedException", message);
        }

        // OverflowException 여부 확인 (Backpressure 버퍼 초과 - IllegalStateException 서브클래스)
        if (ex instanceof IllegalStateException && ex.getMessage() != null
                && ex.getMessage().contains("overflow")) {
            log.error("[ERROR] OverflowException 발생: {}", ex.getMessage());
            return new ErrorResponseDto("OverflowException", ex.getMessage());
        }

        log.error("[ERROR] 처리되지 않은 예외 발생: {}", ex.getMessage(), ex);
        return new ErrorResponseDto(ex.getClass().getSimpleName(), ex.getMessage());
    }
}
