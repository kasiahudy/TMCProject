package pl.gdansk.skpt.MapCreatorREST.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.gdansk.skpt.MapCreatorREST.model.CheckPoint;
import pl.gdansk.skpt.MapCreatorREST.model.Marker;
import pl.gdansk.skpt.MapCreatorREST.model.Track;
import pl.gdansk.skpt.MapCreatorREST.services.CheckPointService;
import pl.gdansk.skpt.MapCreatorREST.services.MarkerService;

import java.util.List;
import java.util.UUID;

/**
 * Controller of checkpoints.
 * @see CheckPoint
 */
@RestController
@RequestMapping("/checkpoints")
public class CheckpointController {
    final CheckPointService checkPointService;
    final MarkerService markerService;


    public CheckpointController(CheckPointService checkPointService,MarkerService markerService){
        this.checkPointService = checkPointService;
        this.markerService = markerService;
    }

    /**
     * Adds marker to affiliates list in certain checkpoint.
     * @param checkPointId Checkpoint id in database.
     * @param affiliateId Marker id in database.
     * @return Status of the operation.
     * @see CheckPoint
     * @see Marker
     */
    @PutMapping("/affiliates")
    public ResponseEntity<String> addAffiliateMarker(@RequestParam UUID checkPointId,
                                                     @RequestParam UUID affiliateId){
        CheckPoint checkPoint = checkPointService.find(checkPointId);
        Marker affiliateMarker = markerService.find(affiliateId);

        if(affiliateMarker == null || affiliateMarker.getLanternCode() == null) return new ResponseEntity<>("Marker is not a lantern or does not exist", HttpStatus.BAD_REQUEST);
        if(checkPoint != null){
            if(!checkPoint.getAffiliateMarkers().contains(affiliateMarker)){
                checkPoint.getAffiliateMarkers().add(affiliateMarker);
                checkPointService.save(checkPoint);
                return new ResponseEntity<>("Added affiliate",HttpStatus.OK);
            }else{
                return new ResponseEntity<>("Already an affiliate",HttpStatus.BAD_REQUEST);
            }
        }else{
            return new ResponseEntity<>("No such Checkpoint",HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Removes marker from affiliates of certain checkpoint.
     * @param checkPointId Checkpoint id in database.
     * @param affiliateId Marker id in database.
     * @return Status of the operation.
     * @see CheckPoint
     * @see Marker
     */
    @DeleteMapping("/affiliates")
    public ResponseEntity<String> removeAffiliateMarker(@RequestParam UUID checkPointId,
                                                     @RequestParam UUID affiliateId){
        CheckPoint checkPoint = checkPointService.find(checkPointId);
        Marker affiliateMarker = markerService.find(affiliateId);


        if(checkPoint != null){
            if(checkPoint.getAffiliateMarkers().contains(affiliateMarker)){
                checkPoint.getAffiliateMarkers().remove(affiliateMarker);
                checkPointService.save(checkPoint);
                return new ResponseEntity<>("Removed affiliate",HttpStatus.OK);
            }else{
                return new ResponseEntity<>("Not an affiliate",HttpStatus.BAD_REQUEST);
            }
        }else{
            return new ResponseEntity<>("No such Checkpoint",HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Gets a list of all affiliates of a certain checkpoint.
     * @param checkPointId Checkpoint id in database.
     * @return Status of the operation.
     */
    @GetMapping("/affiliates")
    public ResponseEntity<List<Marker>> getAllAffiliates(@RequestParam UUID checkPointId){
        CheckPoint checkPoint = checkPointService.find(checkPointId);
        if(checkPoint != null){
            return new ResponseEntity<>(checkPoint.getAffiliateMarkers(),HttpStatus.OK);
        }else{
            return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
        }
    }
}
