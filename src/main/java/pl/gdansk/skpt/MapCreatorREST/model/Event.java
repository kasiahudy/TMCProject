package pl.gdansk.skpt.MapCreatorREST.model;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Class representing the whole event (wydarzenie), the parent of all classes in DB point of view.
 */
@Entity
@Table(name = "events_table")
@EqualsAndHashCode(of = "id")
public class Event {
    /**
     * Unique ID given by DBMS.
     */
    @Id
    @Getter
    @GeneratedValue( strategy= GenerationType.AUTO )
    @Column(name="id")
    private UUID id;

    /**
     * Event name - doesn't have to be unique.
     */
    @Getter
    @Setter
    @Column(name = "event_name", nullable = false)
    private String name;

    /**
     * Date of the event.
     */
    @Getter
    @Setter
    @Column(name = "event_date")
    private LocalDate date;

    /**
     * All markers of current event.
     * Unidirectional relationship.
     * @see Marker
     */
    @Column
    @Setter
    @Getter
    @OneToMany(
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Marker> markers;

    /**
     * All tracks of current event.
     * Unidirectional relationship.
     * @see Track
     */
    @Column
    @Setter
    @Getter
    @OneToMany(
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Track> tracks;

    /**
     * All users with permission to edit current event.
     * Unidirectional relationship.
     * @see SystemUser
     */
    @Column
    @Setter
    @Getter
    @ManyToMany(cascade = {CascadeType.MERGE,CascadeType.PERSIST})
    private List<SystemUser> builders;

}
