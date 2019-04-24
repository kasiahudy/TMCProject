package pl.gdansk.skpt.MapCreatorREST.services;

import com.vividsolutions.jts.geom.Point;
import org.springframework.stereotype.Service;
import pl.gdansk.skpt.MapCreatorREST.model.SiteMap;
import pl.gdansk.skpt.MapCreatorREST.model.SystemUser;

import javax.persistence.EntityManager;
import java.util.List;
import java.util.function.Function;

@Service
public class SiteMapService extends DBService<SiteMap> {
    public SiteMapService(EntityManager entityManager) {
        super(entityManager, SiteMap.class, SiteMap::getName);
    }

    @Override
    public void save(SiteMap entity) {
        super.save(entity);
    }


    public List<Point> getAllPoints(String entity) {
        SiteMap foundMap = entityManager.find(SiteMap.class,entity);
        if(foundMap != null){
            return foundMap.getPoints();
        }
        else{
            return null;
        }
    }

    public List<SiteMap> getAllSiteMaps(){
        return entityManager.createQuery("SELECT o FROM SiteMap o", SiteMap.class).getResultList();
    }
}
