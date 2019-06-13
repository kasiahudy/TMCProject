package pl.gdansk.skpt.MapCreatorREST.model;


import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;
import java.util.UUID;

/**
 * Class representing a track (trasa).
 */
@Entity
@Table(name = "tracks_table")
@EqualsAndHashCode(of = "id")
public class Track {
    /**
     * Unique ID given by DBMS.
     */
    @Id
    @Getter
    @Column(name="id")
    @GeneratedValue( strategy= GenerationType.AUTO )
    private UUID id;

    /**
     * Track's name.
     */
    @Getter
    @Setter
    @Column
    private String name;

    /**
     * Checkpoints which of the current track is made.
     * Unidirectional relationship.
     * @see CheckPoint
     */
    @Column
    @Setter
    @Getter
    @OneToMany(
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<CheckPoint> checkPoints;




}
