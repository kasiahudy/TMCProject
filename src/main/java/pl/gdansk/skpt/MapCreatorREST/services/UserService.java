package pl.gdansk.skpt.MapCreatorREST.services;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import pl.gdansk.skpt.MapCreatorREST.model.SystemUser;
import pl.gdansk.skpt.MapCreatorREST.security.MyUserDetails;

import javax.persistence.EntityManager;

@Service
public class UserService extends DBService<SystemUser> implements UserDetailsService {
    public UserService(EntityManager entityManager) {
        super(entityManager, SystemUser.class, SystemUser::getLogin);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        SystemUser user = find(username);
        if (user == null) {
            throw new UsernameNotFoundException(username);
        }
        return new MyUserDetails(user);
    }
}
