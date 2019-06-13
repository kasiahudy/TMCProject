package pl.gdansk.skpt.MapCreatorREST.services;

import org.springframework.stereotype.Service;
import pl.gdansk.skpt.MapCreatorREST.model.Event;

import javax.persistence.EntityManager;
import java.util.List;
import java.util.UUID;

/**
 * DBService for Events.
 */
@Service
public class EventService extends DBService<Event> {
    public EventService(EntityManager entityManager){
        super(entityManager, Event.class, Event::getId);
    }

    /**
     * Gets all events.
     * @return List of events.
     */
    public List<Event> getAllEvents(){
        return entityManager.createQuery("SELECT o FROM Event o", Event.class).getResultList();
    }



}
