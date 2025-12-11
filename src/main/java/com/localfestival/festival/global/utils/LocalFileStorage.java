package com.localfestival.festival.global.utils;

import com.localfestival.festival.global.exception.CustomException;
import com.localfestival.festival.global.exception.ErrorCode;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Component
public class LocalFileStorage {

    private final String uploadDir = System.getProperty("user.dir") + "/uploads/reviews/";

    public String save(MultipartFile file){
        try{
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();

            Path directory = Paths.get(uploadDir);
            Path filePath = directory.resolve(filename);

            // 폴더 없으면 생성
            if (!Files.exists(directory)) {
                Files.createDirectories(directory);
            }

            // 파일 저장
            file.transferTo(filePath.toFile());

            // DB 저장용 URL
            return "/uploads/reviews/" + filename;

        } catch (Exception e){
            e.printStackTrace();
            throw new CustomException(ErrorCode.FILE_SAVE_FAIL);
        }
    }
}
