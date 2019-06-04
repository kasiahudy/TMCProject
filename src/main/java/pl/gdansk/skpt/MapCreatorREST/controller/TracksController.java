package pl.gdansk.skpt.MapCreatorREST.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.gdansk.skpt.MapCreatorREST.model.CheckPoint;
import pl.gdansk.skpt.MapCreatorREST.model.Track;
import pl.gdansk.skpt.MapCreatorREST.services.TracksService;

import java.util.UUID;

@RestController
@RequestMapping("/tracks")
public class TracksController {

    final TracksService tracksService;
    public TracksController(TracksService ts){tracksService = ts;}

    @PutMapping("/checkpoints")
    public ResponseEntity<UUID> addCheckpointToTrack(@RequestParam UUID id,
                                                     @RequestBody CheckPoint checkPoint){
        Track track = tracksService.find(id);
        if(track != null){
            track.getCheckpoints().add(checkPoint);
            tracksService.save(track);
            return new ResponseEntity<>(checkPoint.getId(), HttpStatus.OK);
        }else{
            return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/checkpoints")
    public ResponseEntity<String> addCheckpointToTrack(@RequestParam UUID trackId,
                                                     @RequestParam UUID checkPointId){
        Track track = tracksService.find(trackId);
        if(track != null){
            CheckPoint checkPoint = track.getCheckpoints().stream()
                    .filter(c -> c.getId() == checkPointId)
                    .findAny()
                    .orElse(null);
            if(checkPoint != null){
                track.getCheckpoints().remove(checkPoint);
                tracksService.save(track);
                return new ResponseEntity<>("", HttpStatus.OK);
            }else{
                return new ResponseEntity<>("No such Track",HttpStatus.NOT_FOUND);
            }

        }else{
            return new ResponseEntity<>("No such Checkpoint in Track",HttpStatus.NOT_FOUND);
        }
    }
}