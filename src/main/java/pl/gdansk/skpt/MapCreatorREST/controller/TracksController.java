package pl.gdansk.skpt.MapCreatorREST.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.gdansk.skpt.MapCreatorREST.model.CheckPoint;
import pl.gdansk.skpt.MapCreatorREST.model.Marker;
import pl.gdansk.skpt.MapCreatorREST.model.Track;
import pl.gdansk.skpt.MapCreatorREST.services.CheckPointService;
import pl.gdansk.skpt.MapCreatorREST.services.MarkerService;
import pl.gdansk.skpt.MapCreatorREST.services.TracksService;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/tracks")
public class TracksController {

    final TracksService tracksService;
    final MarkerService markerService;
    final CheckPointService checkPointService;
    public TracksController(TracksService tracksService,MarkerService markerService, CheckPointService checkPointService){
        this.tracksService = tracksService;
        this.markerService = markerService;
        this.checkPointService = checkPointService;
    }

    @PutMapping("/checkpoints")
    public ResponseEntity<UUID> addCheckpointToTrack(@RequestParam UUID trackId,
                                                     @RequestBody CheckPoint checkPoint){
        Track track = tracksService.find(trackId);
        if(track != null){
            track.getCheckPoints().add(checkPoint);
            checkPoint.getMainMarker().getMainMarkerOf().add(checkPoint);
            tracksService.save(track);
            return new ResponseEntity<>(checkPoint.getId(), HttpStatus.OK);
        }else{
            return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/checkpoints")
    public ResponseEntity<List<CheckPoint>> getCheckPointsFromTrack(@RequestParam UUID trackId){
        Track track = tracksService.find(trackId);
        if(track != null){
            return new ResponseEntity<>(track.getCheckPoints(), HttpStatus.OK);
        }else{
            return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/checkpoints")
    public ResponseEntity<String> removeCheckpointFromTrack(@RequestParam UUID trackId,
                                                            @RequestParam UUID checkPointId){
        Track track = tracksService.find(trackId);
        if(track != null){
            CheckPoint checkPoint = track.getCheckPoints().stream()
                    .filter(c -> c.getId().compareTo(checkPointId) == 0)
                    .findAny()
                    .orElse(null);
            if(checkPoint != null){
                track.getCheckPoints().remove(checkPoint);
                tracksService.save(track);
                checkPointService.remove(checkPoint);
                return new ResponseEntity<>("", HttpStatus.OK);
            }else{
                return new ResponseEntity<>("No such Track",HttpStatus.NOT_FOUND);
            }

        }else{
            return new ResponseEntity<>("No such Checkpoint in Track",HttpStatus.NOT_FOUND);
        }
    }


}
