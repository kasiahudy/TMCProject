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

@Entity
@Table(name = "markers_table")
@EqualsAndHashCode(of = "id")
public class Marker {
    @Id
    @Getter
    @Column(name="id")
    @GeneratedValue( strategy= GenerationType.AUTO )
    private UUID id;

    @Getter
    @Setter
    @Column(name="lanternCode")
    private String lanternCode;

    @Getter
    @Setter
    @Column(name="tapeCode")
    private String tapeCode;

    @Getter
    @Setter
    @Column(name="coordinate")
    @JsonSerialize(using = PointToJsonSerializer.class)
    @JsonDeserialize(using = JsonToPointDeserializer.class)
    private Point coordinate;

    @Getter
    @Setter
    @JsonIgnore
    @OneToMany(
            mappedBy = "mainMarker",
            fetch = FetchType.EAGER
    )
    private List<CheckPoint> mainMarkerOf = new ArrayList<CheckPoint>();


//
//    public Marker(String tapeCode, String lanternCode, Point point){
//        this.coordinate = point;
//        this.tapeCode = tapeCode;
//        this.lanternCode = lanternCode;
//    }
}
