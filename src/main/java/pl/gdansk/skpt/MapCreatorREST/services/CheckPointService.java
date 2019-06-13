package pl.gdansk.skpt.MapCreatorREST.services;

import org.springframework.stereotype.Service;
import pl.gdansk.skpt.MapCreatorREST.model.CheckPoint;
import javax.persistence.EntityManager;

/**
 * DBService for CheckPoints.
 */
@Service
public class CheckPointService extends  DBService<CheckPoint> {
    public CheckPointService(EntityManager em){
        super(em,CheckPoint.class,CheckPoint::getId);
    }
}
