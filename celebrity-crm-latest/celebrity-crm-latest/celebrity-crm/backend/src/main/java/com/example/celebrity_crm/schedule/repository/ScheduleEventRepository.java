package com.example.celebrity_crm.schedule.repository;

import com.example.celebrity_crm.schedule.model.ScheduleEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ScheduleEventRepository extends JpaRepository<ScheduleEvent, Long> {

    List<ScheduleEvent> findByUserIdOrderByEventDateAscCallTimeAsc(Long userId);

    // the three queries below leave out declined offers

    @Query("select e from ScheduleEvent e where e.userId = :userId and e.type = :type "
            + "and e.eventDate = :date and coalesce(e.response, 'accepted') <> 'declined' "
            + "order by e.callTime limit 1")
    Optional<ScheduleEvent> findFirstByUserIdAndTypeAndEventDateOrderByCallTime(
            @Param("userId") Long userId, @Param("type") String type, @Param("date") LocalDate date);

    @Query("select e from ScheduleEvent e where e.userId = :userId and e.eventDate > :date "
            + "and coalesce(e.response, 'accepted') <> 'declined' "
            + "order by e.eventDate asc, e.callTime asc limit 3")
    List<ScheduleEvent> findTop3ByUserIdAndEventDateAfterOrderByEventDateAscCallTimeAsc(
            @Param("userId") Long userId, @Param("date") LocalDate date);

    @Query("select e from ScheduleEvent e where e.userId = :userId and e.projectName in :names "
            + "and e.eventDate >= :date and coalesce(e.response, 'accepted') <> 'declined' "
            + "order by e.eventDate asc, e.callTime asc limit 1")
    Optional<ScheduleEvent> findFirstByUserIdAndProjectNameInAndEventDateGreaterThanEqualOrderByEventDateAscCallTimeAsc(
            @Param("userId") Long userId, @Param("names") Collection<String> names, @Param("date") LocalDate date);
}