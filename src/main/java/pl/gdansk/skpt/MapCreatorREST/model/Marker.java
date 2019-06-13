package pl.gdansk.skpt.MapCreatorREST.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vividsolutions.jts.geom.Point;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import pl.gdansk.skpt.MapCreatorREST.Util.JsonToPointDeserializer;
import pl.gdansk.skpt.MapCreatorREST.Util.PointToJsonSerializer;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Class representing a marker (tasiemka).
 */
@Entity
@Table(name = "markers_table")
@EqualsAndHashCode(of = "id")
public class Marker {
    /**
     * Unique ID given by DBMS.
     */
    @Id
    @Getter
    @Column(name="id")
    @GeneratedValue( strategy= GenerationType.AUTO )
    private UUID id;

    /**
     * Lantern code (kod lampionu).
     */
    @Getter
    @Setter
    @Column(name="lanternCode")
    private String lanternCode;

    /**
     * Tape code (kod tasiemki).
     */
    @Getter
    @Setter
    @Column(name="tapeCode")
    private String tapeCode;

    /**
     * Spatial point.
     */
    @Getter
    @Setter
    @Column(name="coordinate")
    @JsonSerialize(using = PointToJsonSerializer.class)
    @JsonDeserialize(using = JsonToPointDeserializer.class)
    private Point coordinate;

    /**
     * Child side of Marker-Checkpoint relationship.
     * @see CheckPoint
     */
    @Getter
    @Setter
    @JsonIgnore
    @OneToMany(
            mappedBy = "mainMarker",
            fetch = FetchType.EAGER
    )
    private List<CheckPoint> mainMarkerOf = new ArrayList<CheckPoint>();
}
