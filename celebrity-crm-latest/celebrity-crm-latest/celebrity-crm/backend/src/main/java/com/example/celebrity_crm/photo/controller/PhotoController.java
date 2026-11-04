package com.example.celebrity_crm.photo.controller;

import com.example.celebrity_crm.config.CurrentUser;
import com.example.celebrity_crm.photo.dto.PhotoItem;
import com.example.celebrity_crm.photo.model.Photo;
import com.example.celebrity_crm.photo.service.PhotoService;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/photos")
public class PhotoController {

    private final PhotoService service;
    private final CurrentUser currentUser;

    public PhotoController(PhotoService service, CurrentUser currentUser) {
        this.service = service;
        this.currentUser = currentUser;
    }

    @GetMapping
    public List<PhotoItem> list(Authentication authentication) {
        return service.list(currentUser.id(authentication));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public PhotoItem add(Authentication authentication, @RequestParam("file") MultipartFile file) {
        return service.add(currentUser.id(authentication), file);
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> image(Authentication authentication, @PathVariable Long id) {
        Photo photo = service.get(currentUser.id(authentication), id);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(photo.getContentType()))
                .cacheControl(CacheControl.maxAge(1, TimeUnit.DAYS).cachePrivate())
                .body(photo.getData());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(Authentication authentication, @PathVariable Long id) {
        service.delete(currentUser.id(authentication), id);
    }
}