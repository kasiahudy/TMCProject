package pl.gdansk.skpt.MapCreatorREST.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vividsolutions.jts.geom.Point;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import pl.gdansk.skpt.MapCreatorREST.Util.JsonToPointDeserializer;
import pl.gdansk.skpt.MapCreatorREST.Util.PointToJsonSerializer;
import pl.gdansk.skpt.MapCreatorREST.Util.SingleJsonToPointDeserializer;
import pl.gdansk.skpt.MapCreatorREST.Util.SinglePointToJsonSerializer;

import javax.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "tasiemka_table")
@EqualsAndHashCode(of = "id")
public class Tape {
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
    @JsonSerialize(using = SinglePointToJsonSerializer.class)
    @JsonDeserialize(using = SingleJsonToPointDeserializer.class)
    private Point coordinate;


    public Tape(String tapeCode, String lanternCode, Point point){
        this.coordinate = point;
        this.tapeCode = tapeCode;
        this.lanternCode = lanternCode;
    }
}
