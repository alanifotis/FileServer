package home.fileserver.controllers.internal;

import home.fileserver.workers.ArchiveSyncOrchestrator;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/internal/system")
@RequiredArgsConstructor
@Slf4j
public class SystemEventController {

    private final ArchiveSyncOrchestrator syncOrchestrator;
    private static final String IPV4 = "127.0.0.1";
    private static final String IPV6 = "0:0:0:0:0:0:0:1";

    @GetMapping("/new-device")
    public ResponseEntity<String> handleHardwareEvent(HttpServletRequest request) {
        String clientIp = request.getRemoteAddr();
        if (!IPV4.equals(clientIp) && !IPV6.equals(clientIp)) {
            log.warn("[SECURITY WARN] External attempt to trigger sync rejected from IP: " + clientIp);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        System.out.println("[SYSTEM EVENT] Hardware change detected. Triggering sync orchestrator.");

        // Hand the job off to a lightweight Virtual Thread so the HTTP response is instant
        Thread.startVirtualThread(syncOrchestrator::executeSyncJob);
        
        return ResponseEntity.ok("Sync job queued successfully.");
    }
}