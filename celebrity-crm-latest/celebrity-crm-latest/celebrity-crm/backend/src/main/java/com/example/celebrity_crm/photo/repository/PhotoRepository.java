package com.example.celebrity_crm.photo.repository;

import com.example.celebrity_crm.photo.dto.PhotoItem;
import com.example.celebrity_crm.photo.model.Photo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PhotoRepository extends JpaRepository<Photo, Long> {

    @Query("select new com.example.celebrity_crm.photo.dto.PhotoItem(p.id, p.createdAt) "
            + "from Photo p where p.userId = :userId order by p.id desc")
    List<PhotoItem> findItems(@Param("userId") Long userId);
}