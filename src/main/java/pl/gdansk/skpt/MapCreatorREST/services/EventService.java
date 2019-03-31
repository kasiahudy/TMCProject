package pl.gdansk.skpt.MapCreatorREST.services;

import org.springframework.stereotype.Service;
import pl.gdansk.skpt.MapCreatorREST.model.Event;

import javax.persistence.EntityManager;

@Service
public class EventService extends DBService<Event>{
    public EventService(EntityManager entityManager){
        super(entityManager,Event.class,Event::getId);
    }
}
