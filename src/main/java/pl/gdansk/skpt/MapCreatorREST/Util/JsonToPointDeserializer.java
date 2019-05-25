package pl.gdansk.skpt.MapCreatorREST.Util;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.geom.Point;
import com.vividsolutions.jts.geom.PrecisionModel;
import com.vividsolutions.jts.io.WKTReader;

public class JsonToPointDeserializer extends JsonDeserializer<Point> {

    private final static GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 26910);

    @Override
    public Point deserialize(JsonParser jp, DeserializationContext ctxt)
            throws IOException, JsonProcessingException {


        try {
            String pointAsJSON = jp.getText();
            if (pointAsJSON == null || pointAsJSON.length() <= 0) return null;

                Point point = (Point) new WKTReader().read(pointAsJSON);
            return point;
        }
        catch(Exception e){
            e.printStackTrace();
            return null;
        }
    }

}
