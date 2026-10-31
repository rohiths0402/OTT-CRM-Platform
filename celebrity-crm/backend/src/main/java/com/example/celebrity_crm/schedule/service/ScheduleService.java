package com.example.celebrity_crm.schedule.service;

import com.example.celebrity_crm.project.service.OfferProjectService;
import com.example.celebrity_crm.schedule.dto.ScheduleRequest;
import com.example.celebrity_crm.schedule.dto.ScheduleResponse;
import com.example.celebrity_crm.schedule.model.ScheduleEvent;
import com.example.celebrity_crm.schedule.repository.ScheduleEventRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Service
public class ScheduleService {

    private static final DateTimeFormatter TIME = DateTimeFormatter.ofPattern("h:mm a", Locale.ENGLISH);

    private final ScheduleEventRepository repository;
    private final OfferProjectService offerProjects;

    public ScheduleService(ScheduleEventRepository repository, OfferProjectService offerProjects) {
        this.repository = repository;
        this.offerProjects = offerProjects;
    }

    public List<ScheduleResponse> list(Long userId) {
        return repository.findByUserIdOrderByEventDateAscCallTimeAsc(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    public ScheduleResponse add(Long userId, ScheduleRequest request) {
        ScheduleEvent event = new ScheduleEvent();
        event.setUserId(userId);
        fill(event, request);
        return toResponse(repository.save(event));
    }

    public ScheduleResponse update(Long userId, Long id, ScheduleRequest request) {
        ScheduleEvent event = find(userId, id);
        fill(event, request);
        return toResponse(repository.save(event));
    }

    @Transactional
    public ScheduleResponse accept(Long userId, Long id) {
        ScheduleEvent event = waiting(userId, id);
        event.setResponse("accepted");
        event = repository.save(event);
        if (event.getTotalAmount() > 0) {
            offerProjects.addFromEvent(userId, event);
        }
        return toResponse(event);
    }

    @Transactional
    public ScheduleResponse decline(Long userId, Long id) {
        ScheduleEvent event = waiting(userId, id);
        event.setResponse("declined");
        return toResponse(repository.save(event));
    }

    public void delete(Long userId, Long id) {
        repository.delete(find(userId, id));
    }

    private ScheduleEvent find(Long userId, Long id) {
        return repository.findById(id)
                .filter(e -> e.getUserId().equals(userId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found."));
    }

    private ScheduleEvent waiting(Long userId, Long id) {
        ScheduleEvent event = find(userId, id);
        if (!"pending".equals(event.getResponse())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This offer was already answered.");
        }
        return event;
    }

    private void fill(ScheduleEvent event, ScheduleRequest request) {
        event.setType(request.type());
        event.setTitle(request.title());
        event.setProjectName(request.project());
        event.setEventDate(request.date());
        event.setCallTime(request.callTime());
        event.setWrapTime(request.wrapTime());
        event.setStatus(request.status() == null || request.status().isBlank() ? "confirmed" : request.status());
        event.setStatusNote(request.statusNote());
        event.setOnline(request.online());
        event.setLocation(request.location());
        event.setCity(request.city());
        event.setNotes(request.notes());
        event.setResponse(request.response() == null ? "accepted" : request.response());

        ScheduleRequest.Offer offer = request.offer();
        event.setCompany(offer == null ? null : offer.company());
        event.setAdvanceAmount(offer == null ? 0 : offer.advance());
        event.setTotalAmount(offer == null ? 0 : offer.total());

        ScheduleRequest.Contact contact = request.contact();
        event.setContactName(contact == null ? null : contact.name());
        event.setContactRole(contact == null ? null : contact.role());
        event.setContactPhone(contact == null ? null : contact.phone());

        ScheduleRequest.Pickup pickup = request.pickup();
        event.setPickupTime(pickup == null ? null : pickup.time());
        event.setPickupDriver(pickup == null ? null : pickup.driver());
        event.setPickupVehicle(pickup == null ? null : pickup.vehicle());

        ScheduleRequest.Look look = request.look();
        event.setWardrobe(look == null ? null : look.wardrobe());
        event.setVanity(look == null ? null : look.vanity());
        event.setMakeup(look == null ? null : look.makeup());
    }

    private ScheduleResponse toResponse(ScheduleEvent e) {
        boolean hasOffer = e.getTotalAmount() > 0 || e.getAdvanceAmount() > 0 || e.getCompany() != null;
        ScheduleResponse.Offer offer = hasOffer
                ? new ScheduleResponse.Offer(e.getCompany(), e.getAdvanceAmount(), e.getTotalAmount())
                : null;

        ScheduleResponse.Contact contact = e.getContactName() == null ? null
                : new ScheduleResponse.Contact(e.getContactName(), e.getContactRole(), e.getContactPhone());

        ScheduleResponse.Pickup pickup = e.getPickupTime() == null ? null
                : new ScheduleResponse.Pickup(time(e.getPickupTime()), e.getPickupDriver(), e.getPickupVehicle());

        boolean hasLook = e.getWardrobe() != null || e.getVanity() != null || e.getMakeup() != null;
        ScheduleResponse.Look look = hasLook
                ? new ScheduleResponse.Look(e.getWardrobe(), e.getVanity(), e.getMakeup())
                : null;

        String response = e.getResponse() == null ? "accepted" : e.getResponse();

        return new ScheduleResponse(e.getId(), e.getType(), e.getTitle(), e.getProjectName(),
                e.getEventDate().toString(), time(e.getCallTime()), time(e.getWrapTime()),
                e.getStatus(), e.getStatusNote(), e.isOnline(), e.getLocation(), e.getCity(),
                e.getNotes(), response, offer, contact, pickup, look);
    }

    private String time(LocalTime time) {
        return time == null ? null : time.format(TIME);
    }
}