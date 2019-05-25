package pl.gdansk.skpt.MapCreatorREST.controller;


import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.gdansk.skpt.MapCreatorREST.services.MarkerService;

@RestController
@RequestMapping("/tapes")
public class MarkerController {

    final MarkerService markerService;
    public MarkerController(MarkerService service){this.markerService = service;}
}
