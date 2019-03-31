package pl.gdansk.skpt.MapCreatorREST.model;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "user_table")
@EqualsAndHashCode(of = "login")
public class SystemUser {

    public enum PriviligeLevels{
        NORMAL_USER,
        SUPER_USER;
    }

    @Id
    @Getter
    @Column(name = "login")
    private String login;

    @Getter
    @Column(name = "firstName")
    private String firstName;

    @Getter
    @Column(name = "surName")
    private String surName;

    @Getter
    @Setter
    @Column(name = "email")
    private String email;

    @Getter
    @Setter
    @Column(name = "password")
    private String password;

    @Setter
    @Getter
    @Column(name = "privilage")
    private PriviligeLevels privilage;

//    public SystemUser(){
//    }
//
//    public SystemUser(String firstName, String surName, String email, String login, String password){
//        this.firstName = firstName;
//        this.surName = surName;
//        this.email = email;
//        this.login = login;
//        this.password = password;
//        this.privilage = PriviligeLevels.NORMAL_USER;
//    }

}
