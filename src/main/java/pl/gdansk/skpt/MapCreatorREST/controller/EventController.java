package pl.gdansk.skpt.MapCreatorREST.controller;

import com.vividsolutions.jts.geom.Point;
import com.vividsolutions.jts.io.ParseException;
import com.vividsolutions.jts.io.WKTReader;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.gdansk.skpt.MapCreatorREST.model.Event;
import pl.gdansk.skpt.MapCreatorREST.model.SystemUser;
import pl.gdansk.skpt.MapCreatorREST.model.Marker;
import pl.gdansk.skpt.MapCreatorREST.model.Track;
import pl.gdansk.skpt.MapCreatorREST.services.EventService;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/events")
public class EventController {

    final EventService eventService;
    public EventController(EventService eventService){
        this.eventService = eventService;
    }

    @PostMapping("/add")
    public ResponseEntity<UUID> addEvent(@RequestBody Event newEvent){

            eventService.save(newEvent);

        return new ResponseEntity<>(newEvent.getId(), HttpStatus.NOT_IMPLEMENTED);
    }

    @GetMapping()
    public  List<Event> getAllEvents(){
        return eventService.getAllEvents();
    }

    @GetMapping("/{id}")
    public  ResponseEntity<Event> getEvent(@PathVariable UUID id){
        Event event = eventService.find(id);
        if(event != null){
            return new ResponseEntity<>(event,HttpStatus.OK);
        }else{
            return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/markers")
    public  ResponseEntity<List<Marker>> getMarkersFromEvent(@RequestParam UUID eventId){
        Event event = eventService.find(eventId);
        if(event != null){
            return new ResponseEntity<>(event.getMarkers(),HttpStatus.OK);
        }else{
            return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
        }
    }

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

    @PutMapping("/markers")
    public  ResponseEntity<String> getMarkersFromEvent(@RequestParam UUID eventId,
                                                       @RequestBody Marker newMarker){
        Event event = eventService.find(eventId);
        if(event != null){
            event.getMarkers().add(newMarker);
            eventService.save(event);
            return new ResponseEntity<>("Added new marker",HttpStatus.OK);
        }else{
            return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/markers")
    public  ResponseEntity<String> getMarkerFromEvent(@RequestParam UUID eventId,
                                                      @RequestParam UUID markerId){
        Event event = eventService.find(eventId);
        if(event != null){
            Marker marker = event.getMarkers().stream()
                    .filter(m -> m.getId() == markerId)
                    .findAny()
                    .orElse(null);
            if(marker != null){
                event.getMarkers().remove(marker);
                eventService.save(event);
                return new ResponseEntity<>("Removed track",HttpStatus.OK);
            }else{
                return new ResponseEntity<>("No such marker in Event",HttpStatus.NOT_FOUND);
            }
        }else{
            return new ResponseEntity<>("No such Event",HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/tracks")
    public  ResponseEntity<List<Track>> getTracksFromEvent(@RequestParam UUID eventId){
        Event event = eventService.find(eventId);
        if(event != null){
            return new ResponseEntity<>(event.getTracks(),HttpStatus.OK);
        }else{
            return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/tracks")
    public  ResponseEntity<String> getTracksFromEvent(@RequestParam UUID eventId,
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

    @DeleteMapping("/tracks")
    public  ResponseEntity<String> getTrackFromEvent(@RequestParam UUID eventId,
                                                     @RequestParam UUID trackId){
        Event event = eventService.find(eventId);
        if(event != null){
            Track track = event.getTracks().stream()
                    .filter(t -> t.getId() == trackId)
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


}
