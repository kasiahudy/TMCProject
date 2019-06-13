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

/**
 * List version of {@link JsonToPointDeserializer}
 */
public class JsonToPointsListDeserializer extends JsonDeserializer<List<Point>> {

    private final static GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 26910);

    @Override
    public List<Point> deserialize(JsonParser jp, DeserializationContext ctxt)
            throws IOException, JsonProcessingException {

        List<Point> listOfPoints = new ArrayList<Point>();
        try {
            String pointsAsJSON = jp.getText();
            if(pointsAsJSON == null || pointsAsJSON.length() <= 0)
                return null;

            String[] serializedPointsTable = pointsAsJSON.split(";");
            for(String serializedPoint : serializedPointsTable){
                Point point = (Point) new WKTReader().read(serializedPoint);
                listOfPoints.add(point);
            }
            return listOfPoints;
        }
        catch(Exception e){
            e.printStackTrace();
            return null;
        }
    }

}
