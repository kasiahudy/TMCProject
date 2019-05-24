package pl.gdansk.skpt.MapCreatorREST.controller;

import com.vividsolutions.jts.geom.Point;
import com.vividsolutions.jts.io.ParseException;
import com.vividsolutions.jts.io.WKTReader;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.gdansk.skpt.MapCreatorREST.model.Event;
import pl.gdansk.skpt.MapCreatorREST.model.EventEnchanced;
import pl.gdansk.skpt.MapCreatorREST.model.SystemUser;
import pl.gdansk.skpt.MapCreatorREST.model.Tape;
import pl.gdansk.skpt.MapCreatorREST.services.EventEnchancedService;
import pl.gdansk.skpt.MapCreatorREST.services.EventService;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/events2")
public class EventEnchancedController {

    final EventEnchancedService eventService;
    public EventEnchancedController(EventEnchancedService eventService){
        this.eventService = eventService;
    }

    @PostMapping("/add")
    public ResponseEntity<String> addEvent(EventEnchanced newEvent){
        return new ResponseEntity<>("not implemented", HttpStatus.NOT_IMPLEMENTED);
    }

    @GetMapping("/sample")
    public  ResponseEntity<EventEnchanced> addSampleEvent(){
        EventEnchanced eventEnchanced;
        try {
            Tape tape1 = new Tape("Tasiemka 1","Lampion 1", (Point) new WKTReader().read("POINT (1 1)"));
            Tape tape2 = new Tape("Tasiemka 2",null, (Point) new WKTReader().read("POINT (2 2)"));
            Tape tape3 = new Tape("Tasiemka 3","Lampion 3", (Point) new WKTReader().read("POINT (3 41)"));


        List<Tape> sampleTapes = new ArrayList<Tape>();
        sampleTapes.add(tape1);
        sampleTapes.add(tape2);
        sampleTapes.add(tape3);


        SystemUser user1 = new SystemUser("Jan","Nowak","jnowak@wp.pl","jnowak","adasdasdsa");
        SystemUser user2 = new SystemUser("Pawel","Kowalski","pkowal@wp.pl","pkowal","hsadsa");
        List<SystemUser> sampleUsers = new ArrayList<SystemUser>();
        sampleUsers.add(user1);
        sampleUsers.add(user2);


       eventEnchanced = new EventEnchanced("Event przykladowy", LocalDate.now(),sampleTapes,sampleUsers);

        return new ResponseEntity<EventEnchanced>(eventEnchanced,HttpStatus.OK);
        } catch (ParseException e) {
            e.printStackTrace();
            return new ResponseEntity<EventEnchanced>(new EventEnchanced(),HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping()
    public  List<EventEnchanced> getEvent(){
        return eventService.getAllEvents();
    }
}
