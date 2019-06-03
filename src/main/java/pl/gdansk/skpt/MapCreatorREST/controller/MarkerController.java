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

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteMarker(@PathVariable UUID id){
        Marker marker = markerService.find(id);
        if(marker != null) {
            markerService.remove(marker);
            return new ResponseEntity<>("Successfully removed", HttpStatus.OK);
        }else{
            return new ResponseEntity<>("",HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/add")
    public ResponseEntity<UUID> deleteMarker(@RequestBody Marker newMarker){

            markerService.save(newMarker);
            return new ResponseEntity<>(newMarker.getId(), HttpStatus.OK);

    }
}
