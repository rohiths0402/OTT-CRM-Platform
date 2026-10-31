package com.example.celebrity_crm.profile.service;

import com.example.celebrity_crm.auth.StaffUser;
import com.example.celebrity_crm.auth.StaffUserRepository;
import com.example.celebrity_crm.profile.dto.ProfileRequest;
import com.example.celebrity_crm.profile.dto.ProfileResponse;
import com.example.celebrity_crm.profile.model.CelebrityProfile;
import com.example.celebrity_crm.profile.model.ProfilePhoto;
import com.example.celebrity_crm.profile.repository.CelebrityProfileRepository;
import com.example.celebrity_crm.profile.repository.ProfilePhotoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProfileService {

    private final CelebrityProfileRepository repository;
    private final ProfilePhotoRepository photos;
    private final StaffUserRepository users;

    public ProfileService(CelebrityProfileRepository repository, ProfilePhotoRepository photos,
                          StaffUserRepository users) {
        this.repository = repository;
        this.photos = photos;
        this.users = users;
    }

    public ProfileResponse get(Long userId) {
        StaffUser user = findUser(userId);
        CelebrityProfile profile = repository.findByUserId(userId).orElseGet(CelebrityProfile::new);
        return toResponse(user, profile, photoOf(userId));
    }

    public ProfileResponse save(Long userId, ProfileRequest request) {
        StaffUser user = findUser(userId);
        CelebrityProfile profile = repository.findByUserId(userId).orElseGet(CelebrityProfile::new);
        profile.setUserId(userId);

        if (request.name() != null && !request.name().isBlank()) {
            user.setName(request.name().trim());
            users.save(user);
        }

        profile.setPhone(clean(request.phone()));
        profile.setLocation(clean(request.location()));
        profile.setBio(clean(request.bio()));
        profile.setInstagram(clean(request.instagram()));
        profile.setYoutube(clean(request.youtube()));

        if (request.roleTitle() != null) {
            profile.setRoleTitle(request.roleTitle());
        }
        if (request.managerName() != null) {
            profile.setManagerName(request.managerName());
        }
        if (request.managerPhone() != null) {
            profile.setManagerPhone(request.managerPhone());
        }

        String photo = savePhoto(userId, clean(request.imageUrl()));
        return toResponse(user, repository.save(profile), photo);
    }

    private String savePhoto(Long userId, String photo) {
        if (photo == null) {
            photos.findByUserId(userId).ifPresent(photos::delete);
            return null;
        }
        ProfilePhoto saved = photos.findByUserId(userId).orElseGet(ProfilePhoto::new);
        saved.setUserId(userId);
        saved.setPhoto(photo);
        photos.save(saved);
        return photo;
    }

    private String photoOf(Long userId) {
        return photos.findByUserId(userId).map(ProfilePhoto::getPhoto).orElse(null);
    }

    private StaffUser findUser(Long userId) {
        return users.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please sign in."));
    }

    private String clean(String text) {
        return text == null || text.isBlank() ? null : text.trim();
    }

    private ProfileResponse toResponse(StaffUser user, CelebrityProfile p, String photo) {
        return new ProfileResponse(user.getName(), user.getEmail(), p.getPhone(), p.getLocation(),
                p.getBio(), p.getInstagram(), p.getYoutube(), photo,
                p.getRoleTitle(), p.getManagerName(), p.getManagerPhone());
    }
}