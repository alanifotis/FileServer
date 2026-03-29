package home.fileserver.workers;

import java.nio.file.Path;
import java.util.List;

import org.springframework.stereotype.Component;

import home.fileserver.dto.PendingFileTransfer;
import home.fileserver.repositories.FileBlobSyncRepository;
import home.fileserver.service.FileTransferService;
import home.fileserver.service.helper.ArchiveDriveLocator;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ArchiveSyncOrchestrator {

    private final FileBlobSyncRepository syncRepository;
    private final FileTransferService fileTransferService;
    private final ArchiveDriveLocator driveLocator;

    /**
     * Triggered on-demand by the SystemEventController.
     */
    public void executeSyncJob() {
        // 1. Force the locator to verify the drive is actually OUR archive drive
        Path externalDrivePath = driveLocator.forceScanAndVerify();
        
        if (externalDrivePath == null) {
            System.out.println("[SYNC JOB] Event fired, but verified marker file was not found. Ignoring event.");
            return;
        }

        // 2. Fetch the pending files
        List<PendingFileTransfer> pendingFiles = syncRepository.getPendingTransfers();

        if (pendingFiles.isEmpty()) {
            System.out.println("[SYNC JOB] Drive verified, but no pending files to transfer.");
            return; 
        }

        System.out.println("[SYNC JOB] Dispatching " + pendingFiles.size() + " files to Virtual Threads.");

        // 3. Dispatch to the Async Transfer Service
        for (PendingFileTransfer file : pendingFiles) {
            fileTransferService.safelyTransferFile(file, externalDrivePath);
        }
    }
}