package pl.gdansk.skpt.MapCreatorREST.model;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "checkpoints_table")
@EqualsAndHashCode(of = "id")
public class CheckPoint {
    @Id
    @Getter
    @Column(name="id")
    @GeneratedValue( strategy= GenerationType.AUTO )
    private UUID id;


    @JoinColumn(name = "marker_id")
    @ManyToOne(
            fetch = FetchType.EAGER
    )
    @Setter
    @Getter
    Marker mainMarker;

    @Setter
    @Getter
    @OneToMany(
        cascade = CascadeType.ALL
    )
    List<Marker> affiliateMarkers;




}
