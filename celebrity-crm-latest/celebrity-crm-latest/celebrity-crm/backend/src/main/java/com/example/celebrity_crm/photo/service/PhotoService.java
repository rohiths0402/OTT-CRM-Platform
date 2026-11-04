package com.example.celebrity_crm.photo.service;

import com.example.celebrity_crm.photo.dto.PhotoItem;
import com.example.celebrity_crm.photo.model.Photo;
import com.example.celebrity_crm.photo.repository.PhotoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;

@Service
public class PhotoService {

    private static final int KEEP = 8;
    private static final long MAX_BYTES = 2 * 1024 * 1024;

    private final PhotoRepository repository;

    public PhotoService(PhotoRepository repository) {
        this.repository = repository;
    }

    public List<PhotoItem> list(Long userId) {
        return repository.findItems(userId);
    }

    public PhotoItem add(Long userId, MultipartFile file) {
        String type = file.getContentType();
        if (file.isEmpty() || type == null || !type.startsWith("image/")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Please choose an image file.");
        }
        if (file.getSize() > MAX_BYTES) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Photo must be under 2 MB.");
        }

        Photo photo = new Photo();
        photo.setUserId(userId);
        photo.setContentType(type);
        try {
            photo.setData(file.getBytes());
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Could not read the photo.");
        }
        photo = repository.save(photo);

        List<PhotoItem> items = repository.findItems(userId);
        for (int i = KEEP; i < items.size(); i++) {
            repository.deleteById(items.get(i).id());
        }
        return new PhotoItem(photo.getId(), photo.getCreatedAt());
    }

    public Photo get(Long userId, Long id) {
        return repository.findById(id)
                .filter(p -> p.getUserId().equals(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Photo not found."));
    }

    public void delete(Long userId, Long id) {
        repository.delete(get(userId, id));
    }
}