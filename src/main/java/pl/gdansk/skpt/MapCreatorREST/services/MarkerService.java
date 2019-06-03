package pl.gdansk.skpt.MapCreatorREST.services;

import org.springframework.stereotype.Service;
import pl.gdansk.skpt.MapCreatorREST.model.Marker;

import javax.persistence.EntityManager;
import java.util.function.Function;

@Service
public class MarkerService extends DBService<Marker>{
    public MarkerService(EntityManager entityManager) {
        super(entityManager, Marker.class, Marker::getId);
    }
}
