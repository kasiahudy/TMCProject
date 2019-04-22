package pl.gdansk.skpt.MapCreatorREST.model;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vividsolutions.jts.geom.Point;
import com.vividsolutions.jts.io.ParseException;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import com.vividsolutions.jts.io.WKTReader;
import pl.gdansk.skpt.MapCreatorREST.Util.JsonToPointDeserializer;
import pl.gdansk.skpt.MapCreatorREST.Util.PointToJsonSerializer;

@Entity
@Table(name = "site_maps_table")
@EqualsAndHashCode(of = "name")
public class SiteMap {

    public SiteMap(){

    }

    public SiteMap(String name, List<Point> points,int i){
        this.name = name;
        this.points = points;

    }

    public SiteMap(String name, List<String> pointsAsStrings){
        this.name = name;
        points = new ArrayList<Point>();
        for(String s : pointsAsStrings){
            try {
                points.add((Point) new WKTReader().read(s));
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
    }

    @Id
    @Getter
    @Column(name="name")
    private String name;


    @Getter
    @Setter
    @ElementCollection
    @JsonSerialize(using = PointToJsonSerializer.class)
    @JsonDeserialize(using = JsonToPointDeserializer.class)
    List<Point> points;
}
