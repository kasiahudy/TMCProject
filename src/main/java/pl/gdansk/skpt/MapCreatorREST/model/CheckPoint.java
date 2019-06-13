package pl.gdansk.skpt.MapCreatorREST.model;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;
import java.util.UUID;

/**
 * Class representing a checkpoint (punkt kontrolny) on a Track(trasa).
 */
@Entity
@Table(name = "checkpoints_table")
@EqualsAndHashCode(of = "id")
public class CheckPoint {
    /**
     * Unique ID given by DBMS.
     */
    @Id
    @Getter
    @Column(name="id")
    @GeneratedValue( strategy= GenerationType.AUTO )
    private UUID id;

    /**
     * Parent side of the Marker-CheckPoint relationship (punkt główny).
     * @see Marker
     */
    @JoinColumn(name = "marker_id")
    @ManyToOne(
            fetch = FetchType.EAGER
    )
    @Setter
    @Getter
    Marker mainMarker;

    /**
     * List of all affiliate markers (punkty stowarzyszone).
     * @see Marker
     */
    @Setter
    @Getter
    @OneToMany(
        cascade = CascadeType.ALL
    )
    List<Marker> affiliateMarkers;




}
