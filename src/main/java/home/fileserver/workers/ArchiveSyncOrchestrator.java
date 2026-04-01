package home.fileserver.workers;

import java.nio.file.Path;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.atomic.AtomicBoolean;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import home.fileserver.dto.PendingFileTransfer;
import home.fileserver.repositories.FileBlobSyncRepository;
import home.fileserver.service.FileTransferService;
import home.fileserver.service.helper.ArchiveDriveLocator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class ArchiveSyncOrchestrator {

    private final FileBlobSyncRepository syncRepository;
    private final ArchiveDriveLocator driveLocator;
    private final FileTransferService fileTransferService;


    // The Ultimate Concurrency Lock: Ensures only ONE sync operation ever happens at a time.
    private final AtomicBoolean isSyncing = new AtomicBoolean(false);



    /**
     * Runs automatically every 60 seconds (adjust as needed).
     * Because we use fixedDelay, Spring won't start the countdown for the next run 
     * until the current run is completely finished.
     */
    @Scheduled(cron = "0 0 2 * * *", zone = "UTC")
    public void scheduledSyncTick() {
        log.info("scheduledSyncTick is called.");
        executeSyncJob();
    }

    /**
     * The core logic. Can be safely called by the Webhook OR the Scheduled Tick.
     */
    public void executeSyncJob() {
        // 1. Thread Safety: If a sync is already running, quietly exit.
        if (!isSyncing.compareAndSet(false, true)) {
            return; 
        }

        try {
            // 2. Hardware Check
            Path externalDrivePath = driveLocator.getVerifiedExternalRoot();
            if (externalDrivePath == null) {
                return; // Drive offline. Exit silently.
            }

            log.info("[SYNC START] Verified archive drive connected. Beginning sync.");

            // 3. The Batch Loop
            while (true) {
                List<PendingFileTransfer> batch = syncRepository.getPendingTransfers();

                if (batch.isEmpty()) {
                    log.info("[SYNC COMPLETE] All pending files have been archived.");
                    break;
                }

                log.info("[SYNC BATCH] Spawning " + batch.size() + " Virtual Threads...");

                try (ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor()) {
                    
                    List<Callable<Boolean>> tasks = batch.stream()
                        .map(file -> (Callable<Boolean>) () -> fileTransferService.safelyTransferFile(file, externalDrivePath))
                        .toList();

                    List<Future<Boolean>> results = executor.invokeAll(tasks);

                    int successCount = 0;
                    for (Future<Boolean> result : results) {
                        if (result.get()) {
                            successCount++;
                        }
                    }
                    
                    log.info("[SYNC BATCH SUMMARY] " + successCount + "/" + batch.size() + " files transferred successfully.");

                    // Break the loop if the batch failed (prevents infinite loop on corrupted files)
                    if (successCount == 0) {
                        log.info("[SYNC FATAL] 0 files transferred. Aborting batch loop.");
                        break;
                    }

                } catch (Exception e) {
                    log.info("[SYNC FATAL] Thread manager error: " + e.getMessage());
                    break;
                }
            }
        } finally {
            // ALWAYS release the lock when finished, even if an exception occurs
            isSyncing.set(false);
        }
    }
}