package pl.gdansk.skpt.MapCreatorREST.services;

import org.springframework.stereotype.Service;
import pl.gdansk.skpt.MapCreatorREST.model.Event;
import pl.gdansk.skpt.MapCreatorREST.model.EventEnchanced;
import pl.gdansk.skpt.MapCreatorREST.model.SystemUser;

import javax.persistence.EntityManager;
import java.util.List;

@Service
public class EventEnchancedService extends DBService<EventEnchanced> {
    public EventEnchancedService(EntityManager entityManager){
        super(entityManager, EventEnchanced.class,EventEnchanced::getId);
    }

    public List<EventEnchanced> getAllEvents(){
        return entityManager.createQuery("SELECT o FROM EventEnchanced o", EventEnchanced.class).getResultList();
    }
}
