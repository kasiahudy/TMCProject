package pl.gdansk.skpt.MapCreatorREST.controller;


import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.gdansk.skpt.MapCreatorREST.services.TapeService;

@RestController
@RequestMapping("/tapes")
public class TapeController {

    final TapeService tapeService;
    public TapeController(TapeService service){this.tapeService = service;}
}
