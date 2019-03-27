package pl.gdansk.skpt.MapCreatorREST.services;

import org.springframework.stereotype.Service;
import pl.gdansk.skpt.MapCreatorREST.model.User;

import javax.persistence.EntityManager;
import java.util.function.Function;

@Service
public class UserService extends DBService<User> {
    public UserService(EntityManager entityManager) {
        super(entityManager, User.class, User::getLogin);
    }
}
