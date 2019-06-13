package pl.gdansk.skpt.MapCreatorREST.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.gdansk.skpt.MapCreatorREST.model.SystemUser;
import pl.gdansk.skpt.MapCreatorREST.security.MyUserDetails;

import javax.persistence.EntityManager;
import java.util.List;

/**
 * DBService for Users.
 */
@Service
public class UserService extends DBService<SystemUser> implements UserDetailsService {

    @Autowired
    public PasswordEncoder encoder() {
        return new BCryptPasswordEncoder(11);
    }

    public UserService(EntityManager entityManager) {
        super(entityManager, SystemUser.class, SystemUser::getLogin);
    }

    /**
     * Encrypts a password and then saves new user.
     * @param entity
     */
    @Override
    public void save(SystemUser entity) {
        entity.setPassword(encoder().encode(entity.getPassword()));
        super.save(entity);
    }

    /**
     * Loads user details.
     * @param username User to load.
     * @return UserDetails of a certain user.
     * @throws UsernameNotFoundException
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        SystemUser user = find(username);
        if (user == null) {
            throw new UsernameNotFoundException(username);
        }
        return new MyUserDetails(user);
    }

    /**
     * Get all users.
     * @return List of all users.
     */
    public List<SystemUser> getAllUsers(){
        return entityManager.createQuery("SELECT o FROM SystemUser o", SystemUser.class).getResultList();
    }
}
