package pl.gdansk.skpt.MapCreatorREST.controller;


import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.geom.Point;
import com.vividsolutions.jts.io.ParseException;
import com.vividsolutions.jts.io.WKTReader;
import org.geolatte.geom.Geometries;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.gdansk.skpt.MapCreatorREST.model.SiteMap;
import pl.gdansk.skpt.MapCreatorREST.services.SiteMapService;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/maps")
public class SiteMapController {

    final SiteMapService siteMapService;

    public SiteMapController(SiteMapService sms){this.siteMapService=sms;}

    @PostMapping()
    ResponseEntity<String> saveMap(@RequestBody SiteMap siteMap){
        if(siteMapService.find(siteMap.getName()) == null){
            siteMapService.save(siteMap);
            return new ResponseEntity<>("Added new map",HttpStatus.OK);
        }else{
            siteMapService.save(siteMap);
            return new ResponseEntity<>("Updated map",HttpStatus.OK);
        }
    }

    @GetMapping("/points")
    public ResponseEntity<SiteMap> getAllPointsFromMap(@RequestParam String mapName){
        if(siteMapService.find(mapName) == null){
            return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
        }else{
            return new ResponseEntity<SiteMap>(siteMapService.find(mapName),HttpStatus.OK);
        }
    }

    @GetMapping("/sample")
    public ResponseEntity<SiteMap> getSampleMap(){
        List<Point> listOfPoints = new ArrayList<Point>();
        try {
            listOfPoints.add((Point) new WKTReader().read("POINT (1 1)"));
            listOfPoints.add((Point) new WKTReader().read("POINT (2 2)"));
            listOfPoints.add((Point) new WKTReader().read("POINT (3 4)"));
        } catch (ParseException e) {
            e.printStackTrace();
        }
        SiteMap siteMap = new SiteMap("Przykladowa mapka",listOfPoints,0);
        return new ResponseEntity<>(siteMap,HttpStatus.OK);
    }

}
