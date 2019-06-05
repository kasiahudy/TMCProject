package pl.gdansk.skpt.MapCreatorREST.controller;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.gdansk.skpt.MapCreatorREST.model.Marker;
import pl.gdansk.skpt.MapCreatorREST.services.MarkerService;

import java.util.UUID;

@RestController
@RequestMapping("/markers")
public class MarkerController {

    final MarkerService markerService;
    public MarkerController(MarkerService service){this.markerService = service;}

    @GetMapping("{id}")
    public ResponseEntity<Marker> getMarker(@PathVariable UUID id){
        Marker marker = markerService.find(id);
        if(marker != null) {
            return new ResponseEntity<>(marker, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
        }
    }

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
