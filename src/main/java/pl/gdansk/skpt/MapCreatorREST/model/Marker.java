package pl.gdansk.skpt.MapCreatorREST.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vividsolutions.jts.geom.Point;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import pl.gdansk.skpt.MapCreatorREST.Util.JsonToPointDeserializer;
import pl.gdansk.skpt.MapCreatorREST.Util.PointToJsonSerializer;

import javax.persistence.*;
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
    @Column(name="lanternCode")
    private String lanternCode;

    @Getter
    @Column(name="tapeCode")
    private String tapeCode;

    @Getter
    @Column(name="coordinate")
    @JsonSerialize(using = PointToJsonSerializer.class)
    @JsonDeserialize(using = JsonToPointDeserializer.class)
    private Point coordinate;

//
//    public Marker(String tapeCode, String lanternCode, Point point){
//        this.coordinate = point;
//        this.tapeCode = tapeCode;
//        this.lanternCode = lanternCode;
//    }
}
