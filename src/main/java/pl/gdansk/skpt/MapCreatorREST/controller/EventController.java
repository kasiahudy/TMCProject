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
import pl.gdansk.skpt.MapCreatorREST.services.EventService;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/events")
public class EventController {

    final EventService eventService;
    public EventController(EventService eventService){
        this.eventService = eventService;
    }

    @PostMapping("/add")
    public ResponseEntity<String> addEvent(@RequestBody Event newEvent){

            eventService.save(newEvent);

        return new ResponseEntity<>("not implemented", HttpStatus.NOT_IMPLEMENTED);
    }

//    @GetMapping("/sample")
//    public  ResponseEntity<Event> addSampleEvent(){
//        Event eventEnchanced;
//        try {
//            Marker marker1 = new Marker("Tasiemka 1","Lampion 1", (Point) new WKTReader().read("POINT (1 1)"));
//            Marker marker2 = new Marker("Tasiemka 2",null, (Point) new WKTReader().read("POINT (2 2)"));
//            Marker marker3 = new Marker("Tasiemka 3","Lampion 3", (Point) new WKTReader().read("POINT (3 41)"));
//
//
//        List<Marker> sampleMarkers = new ArrayList<Marker>();
//        sampleMarkers.add(marker1);
//        sampleMarkers.add(marker2);
//        sampleMarkers.add(marker3);
//
//
//        SystemUser user1 = new SystemUser("Jan","Nowak","jnowak@wp.pl","jnowak","adasdasdsa");
//        SystemUser user2 = new SystemUser("Pawel","Kowalski","pkowal@wp.pl","pkowal","hsadsa");
//        List<SystemUser> sampleUsers = new ArrayList<SystemUser>();
//        sampleUsers.add(user1);
//        sampleUsers.add(user2);
//
//
//       eventEnchanced = new Event();
//
//        return new ResponseEntity<Event>(eventEnchanced,HttpStatus.OK);
//        } catch (ParseException e) {
//            e.printStackTrace();
//            return new ResponseEntity<Event>(new Event(),HttpStatus.BAD_REQUEST);
//        }
//    }

    @GetMapping()
    public  List<Event> getEvent(){
        return eventService.getAllEvents();
    }
}
