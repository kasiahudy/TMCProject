package pl.gdansk.skpt.MapCreatorREST.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.gdansk.skpt.MapCreatorREST.model.Marker;
import pl.gdansk.skpt.MapCreatorREST.services.MarkerService;
import java.util.UUID;

/**
 * Controller for markers operations.
 */
@RestController
@RequestMapping("/markers")
public class MarkerController {

    final MarkerService markerService;
    public MarkerController(MarkerService service){this.markerService = service;}

    /**
     * Get a marker.
     * @param id Marker's id.
     * @return Status of the operation.
     */
    @GetMapping("{id}")
    public ResponseEntity<Marker> getMarker(@PathVariable UUID id){
        Marker marker = markerService.find(id);
        if(marker != null) {
            return new ResponseEntity<>(marker, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Adds a new marker.
     * @param marker Marker to add.
     * @return Status of the operation.
     * @deprecated Use {@link EventController#addMarkersToEvent(UUID, Marker)} instead
     */
    @Deprecated
    @PostMapping("")
    public ResponseEntity<String> addMarker(@RequestBody Marker marker){
        if(markerService.find(marker.getId()) != null){
            markerService.save(marker);
            return new ResponseEntity<>("Marker with id " + marker.getId() + " successfully updated",HttpStatus.OK );
        }else{
            return new ResponseEntity<>("No such marker in database. Add it to some event first", HttpStatus.NOT_FOUND);
        }



    }
}
