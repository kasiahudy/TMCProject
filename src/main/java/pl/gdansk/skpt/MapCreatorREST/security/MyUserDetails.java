package pl.gdansk.skpt.MapCreatorREST.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import pl.gdansk.skpt.MapCreatorREST.model.SystemUser;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class MyUserDetails implements UserDetails {

    private SystemUser systemUser;

    public MyUserDetails(SystemUser user){
        systemUser = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String ROLE_PREFIX = "ROLE_";

        List<GrantedAuthority> list = new ArrayList<GrantedAuthority>();

        if(systemUser.getPrivilege() == SystemUser.PrivilegeLevels.SUPER_USER){
            list.add(new SimpleGrantedAuthority(ROLE_PREFIX + "SUPER_USER"));
        }else if(systemUser.getPrivilege() == SystemUser.PrivilegeLevels.NORMAL_USER){

        }

        return list;
    }



    @Override
    public String getPassword() {
        return systemUser.getPassword();
    }

    @Override
    public String getUsername() {
        return systemUser.getLogin();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
