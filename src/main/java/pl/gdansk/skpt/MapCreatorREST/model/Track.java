package pl.gdansk.skpt.MapCreatorREST.model;


import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "tracks_table")
@EqualsAndHashCode(of = "id")
public class Track {

    @Id
    @Getter
    @Column(name="id")
    @GeneratedValue( strategy= GenerationType.AUTO )
    private UUID id;

    @Getter
    @Setter
    @Column
    private String name;


    @Column
    @Setter
    @Getter
    @ManyToMany(
            cascade = CascadeType.ALL
    )
    private List<CheckPoint> checkpoints;




}
