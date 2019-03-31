package pl.gdansk.skpt.MapCreatorREST.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import pl.gdansk.skpt.MapCreatorREST.model.SystemUser;
import pl.gdansk.skpt.MapCreatorREST.services.UserService;

import javax.persistence.EntityManager;

@Service
public class MyUserDetailsService implements UserDetailsService{



    @Override
    public UserDetails loadUserByUsername(String username) {
        SystemUser user = new SystemUser();
        if (user == null) {
            throw new UsernameNotFoundException(username);
        }
        return new MyUserDetails(user);
    }
}
