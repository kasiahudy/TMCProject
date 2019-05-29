package pl.gdansk.skpt.MapCreatorREST.services;

import org.springframework.stereotype.Service;
import pl.gdansk.skpt.MapCreatorREST.model.Event;

import javax.persistence.EntityManager;
import java.util.List;

@Service
public class EventService extends DBService<Event> {
    public EventService(EntityManager entityManager){
        super(entityManager, Event.class, Event::getId);
    }

    public List<Event> getAllEvents(){
        return entityManager.createQuery("SELECT o FROM Event o", Event.class).getResultList();
    }
}
