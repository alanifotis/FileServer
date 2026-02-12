package home.fileserver.errorHandling;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class UploadExceptionHandler {

    @ExceptionHandler({
        org.apache.catalina.connector.ClientAbortException.class,
        org.apache.tomcat.util.http.InvalidParameterException.class,
        org.springframework.web.multipart.MultipartException.class
    })
    public ResponseEntity<Void> handleClientAbort(Exception ex) {
        return ResponseEntity.noContent().build();
    }
}