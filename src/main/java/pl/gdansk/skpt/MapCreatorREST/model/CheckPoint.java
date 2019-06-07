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


    @ManyToOne(
            cascade = {CascadeType.PERSIST,CascadeType.MERGE}
    )
    @Setter
    @Getter
    Marker mainMarker;

    @Setter
    @Getter
    @OneToMany(
        cascade = {CascadeType.PERSIST,CascadeType.MERGE}
    )
    List<Marker> affiliateMarkers;




}