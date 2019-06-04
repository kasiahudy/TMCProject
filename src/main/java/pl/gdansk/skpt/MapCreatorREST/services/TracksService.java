package pl.gdansk.skpt.MapCreatorREST.services;

import org.springframework.stereotype.Service;
import pl.gdansk.skpt.MapCreatorREST.model.Track;

import javax.persistence.EntityManager;
import java.util.function.Function;

@Service
public class TracksService extends DBService<Track>{

    public TracksService(EntityManager entityManager) {
        super(entityManager, Track.class, Track::getId);
    }
}