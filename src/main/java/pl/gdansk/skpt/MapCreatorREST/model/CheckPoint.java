package pl.gdansk.skpt.MapCreatorREST.model;

import lombok.EqualsAndHashCode;
import lombok.Getter;

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


    @OneToOne
    Marker mainMarker;


    @OneToMany(
        cascade = CascadeType.ALL
    )
    List<Marker> affiliateMarkers;




}
