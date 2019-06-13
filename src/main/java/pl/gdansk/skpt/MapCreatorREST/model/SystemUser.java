package pl.gdansk.skpt.MapCreatorREST.model;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Class representing a user.
 */
@Entity
@Table(name = "user_table")
@EqualsAndHashCode(of = "login")
public class SystemUser {

    /**
     * Privilige levels of users.
     */
    public enum PrivilegeLevels {
        NORMAL_USER,
        SUPER_USER
    }

    /**
     * User's login.
     * Must be unique.
     */
    @Id
    @Getter
    @Setter
    @Column(name = "login")
    private String login;

    /**
     * First name.
     */
    @Setter
    @Getter
    @Column(name = "firstName")
    private String firstName;

    /**
     * Surname.
     */
    @Setter
    @Getter
    @Column(name = "surName")
    private String surName;

    /**
     * Email address.
     */
    @Getter
    @Setter
    @Column(name = "email")
    private String email;

    /**
     * Password encoded via Bcrypt.
     */
    @Getter
    @Setter
    @Column(name = "password")
    private String password;

    /**
     * Privilege level of current user.
     */
    @Setter
    @Getter
    @Column(name = "privilege")
    private PrivilegeLevels privilege;

}
