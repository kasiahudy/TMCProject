package pl.gdansk.skpt.MapCreatorREST.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.gdansk.skpt.MapCreatorREST.model.*;
import pl.gdansk.skpt.MapCreatorREST.services.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Main controller of the application since Event is the parent class of all.
 * @see Event
 */
@RestController
@RequestMapping("/events")
public class EventController {

    final EventService eventService;
    final UserService userService;
    final MarkerService markerService;
    final CheckPointService checkPointService;
    final TracksService trackService;
    public EventController(EventService eventService,UserService userService, MarkerService markerService,CheckPointService checkPointService, TracksService trackService){
        this.userService = userService;
        this.eventService = eventService;
        this.markerService = markerService;
        this.checkPointService = checkPointService;
        this.trackService = trackService;
    }

    /**
     * Add new event.
     * @param newEvent Event to add.
     * @return Status of the operation.
     */
    @PostMapping("/add")
    public ResponseEntity<UUID> addEvent(@RequestBody Event newEvent){

            eventService.save(newEvent);

        return new ResponseEntity<>(newEvent.getId(), HttpStatus.NOT_IMPLEMENTED);
    }

    /**
     * Gets all events.
     * @return Status of the operation.
     */
    @GetMapping()
    public  List<Event> getAllEvents(){
        return eventService.getAllEvents();
    }

    /**
     * Gets an event.
     * @param id Id of an event in database.
     * @return Status of the operation.
     */
    @GetMapping("/{id}")
    public  ResponseEntity<Event> getEvent(@PathVariable UUID id){
        Event event = eventService.find(id);
        if(event != null){
            return new ResponseEntity<>(event,HttpStatus.OK);
        }else{
            return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Get all markers from certain event.
     * @param eventId Id of an event which markers should be extracted from.
     * @return Status of the operation.
     */
    @GetMapping("/markers")
    public  ResponseEntity<List<Marker>> getMarkersFromEvent(@RequestParam UUID eventId){
        Event event = eventService.find(eventId);
        if(event != null){
            return new ResponseEntity<>(event.getMarkers(),HttpStatus.OK);
        }else{
            return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Get all lanterns (markers with lanternCode != null) from certain event.
     * @param eventId Id of an event which lanterns should be extracted from.
     * @return Status of the operation.
     * @see Marker
     */
    @GetMapping("/lanterns")
    public  ResponseEntity<List<Marker>> getLanternsFromEvent(@RequestParam UUID eventId){
        Event event = eventService.find(eventId);
        if(event != null){
            return new ResponseEntity<>(event.getMarkers()
                                                .stream()
                                                .filter(marker -> marker.getLanternCode() != null)
                                                .collect(Collectors.toList())
                                        ,HttpStatus.OK);
        }else{
            return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Adds new marker to certain event.
     * @param eventId Id of an event that marker should be added to.
     * @param newMarker New marker's content.
     * @return Status of the operation.
     */
    @PutMapping("/markers")
    public  ResponseEntity<UUID> addMarkersToEvent(@RequestParam UUID eventId,
                                                   @RequestBody Marker newMarker){
        Event event = eventService.find(eventId);
        if(event != null){
            markerService.save(newMarker);
            event.getMarkers().add(newMarker);
            eventService.save(event);
            return new ResponseEntity<>(newMarker.getId(),HttpStatus.OK);
        }else{
            return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Deletes marker existing in certain event.
     * That also deletes checkpoint for which marker was a MainMarker.
     * @param eventId Id of an event that contains marker.
     * @param markerId Id of a marker to be removed.
     * @return Status of the operation.
     * @see CheckPoint
     * @see Marker
     */
    @DeleteMapping("/markers")
    public  ResponseEntity<String> deleteMarkerFromEvent(@RequestParam UUID eventId,
                                                         @RequestParam UUID markerId){
        Event event = eventService.find(eventId);
        if(event != null){
            Marker marker = event.getMarkers().stream()
                    .filter(m -> m.getId().compareTo(markerId) == 0)
                    .findAny()
                    .orElse(null);
            if(marker != null){
                event.getMarkers().remove(marker);
                for(CheckPoint checkPoint : marker.getMainMarkerOf()){
                    Track trackWithCheckPoint = event.getTracks().stream()
                            .filter(t->t.getCheckPoints().contains(checkPoint))
                            .findAny()
                            .orElse(null);
                    trackWithCheckPoint.getCheckPoints().remove(checkPoint);
                    trackService.save(trackWithCheckPoint);
                }
                eventService.save(event);
                return new ResponseEntity<>("Removed marker",HttpStatus.OK);
            }else{
                return new ResponseEntity<>("No such marker in Event",HttpStatus.NOT_FOUND);
            }
        }else{
            return new ResponseEntity<>("No such Event",HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Get all tracks from certain event.
     * @param eventId Id of an event which tracks should be extracted from.
     * @return Status of the operation.
     */
    @GetMapping("/tracks")
    public  ResponseEntity<List<Track>> getTracksFromEvent(@RequestParam UUID eventId){
        Event event = eventService.find(eventId);
        if(event != null){
            return new ResponseEntity<>(event.getTracks(),HttpStatus.OK);
        }else{
            return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Adds a new track to certain event.
     * @param eventId Id of an event which track should be added to.
     * @param newTrack Content of track to add.
     * @return Status of the operation.
     */
    @PutMapping("/tracks")
    public  ResponseEntity<String> addTrackToEvent(@RequestParam UUID eventId,
                                                   @RequestBody Track newTrack){
        Event event = eventService.find(eventId);
        if(event != null){
            event.getTracks().add(newTrack);
            eventService.save(event);
            return new ResponseEntity<>("Added new track",HttpStatus.OK);
        }else{
            return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Deletes a track from event.
     * @param eventId Id of an event which contains a track.
     * @param trackId Id of an track to delete.
     * @return Status of the operation.
     */
    @DeleteMapping("/tracks")
    public  ResponseEntity<String> deleteTrackFromEvent(@RequestParam UUID eventId,
                                                        @RequestParam UUID trackId){
        Event event = eventService.find(eventId);
        if(event != null){
            Track track = event.getTracks().stream()
                    .filter(t -> t.getId().compareTo(trackId) == 0)
                    .findAny()
                    .orElse(null);
            if(track != null){
                event.getTracks().remove(track);
                eventService.save(event);
                return new ResponseEntity<>("Removed track",HttpStatus.OK);
            }else{
                return new ResponseEntity<>("No such track in Event",HttpStatus.NOT_FOUND);
            }
        }else{
            return new ResponseEntity<>("No such Event",HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Adds a user to builders list of an event.
     * @param eventId Id of an event which builder should be added to.
     * @param builderId Id of a user that should become builder of this event.
     * @return Status of the operation.
     * @see Event
     * @see SystemUser
     */
    @PostMapping("/builders")
    public ResponseEntity<String> addBuilderToEvent(@RequestParam UUID eventId,
                                                    @RequestParam String builderId){
        SystemUser user = userService.find(builderId);
        if(user != null){
            Event event = eventService.find(eventId);
            if(event != null){
                if(!event.getBuilders().contains(user)){
                    event.getBuilders().add(user);
                    eventService.save(event);
                    return new ResponseEntity<>("Builder added",HttpStatus.OK);
                }else{
                    return new ResponseEntity<>("Builder already on list",HttpStatus.ALREADY_REPORTED);
                }

            }else{
                return new ResponseEntity<>("Event not found",HttpStatus.NOT_FOUND);
            }
        }else{
            return new ResponseEntity<>("User not found",HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Gets all builders from certain event.
     * @param eventId Id of an event.
     * @return Status of the operation.
     * @see Event
     */
    @GetMapping("/builders")
    public ResponseEntity<List<SystemUser>> getBuildersFromEvent(@RequestParam UUID eventId){
        Event event = eventService.find(eventId);
        if(event != null){
            return new ResponseEntity<>(event.getBuilders(),HttpStatus.OK);
        }else{
            return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
        }

    }

    /**
     * Removes user from builders list of and event.
     * @param eventId Id of an event.
     * @param builderId Id of an user.
     * @return Status of the operation.
     */
    @DeleteMapping("/builders")
    public ResponseEntity<String> deleteBuilderFromEvent(@RequestParam UUID eventId,
                                                         @RequestParam String builderId){
        SystemUser user = userService.find(builderId);
        if(user != null){
            Event event = eventService.find(eventId);
            if(event != null){
                if(event.getBuilders().contains(user)){
                    event.getBuilders().remove(user);
                    eventService.save(event);
                    return new ResponseEntity<>("Builder removed",HttpStatus.OK);
                }else{
                    return new ResponseEntity<>("Builder not on list",HttpStatus.ALREADY_REPORTED);
                }

            }else{
                return new ResponseEntity<>("Event not found",HttpStatus.NOT_FOUND);
            }
        }else{
            return new ResponseEntity<>("User not found",HttpStatus.NOT_FOUND);
        }
    }

}
