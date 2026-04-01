package home.fileserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class FileServerApplication {

	static void main(String[] args) {
		SpringApplication.run(FileServerApplication.class, args);
	}

}
