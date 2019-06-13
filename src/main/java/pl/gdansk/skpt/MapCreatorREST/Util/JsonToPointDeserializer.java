package pl.gdansk.skpt.MapCreatorREST.Util;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.geom.Point;
import com.vividsolutions.jts.geom.PrecisionModel;
import com.vividsolutions.jts.io.WKTReader;
import java.io.IOException;

/**
 * Helper class for geographic point JSON deserialization.
 */
public class JsonToPointDeserializer extends JsonDeserializer<Point> {

    private final static GeometryFactory geometryFactory = new GeometryFactory(new PrecisionModel(), 26910);

    /**
     * Deserializes point.
     * @param jp JsonParser
     * @param ctxt DeserializationContext
     * @return Deserialized Point
     * @throws IOException WKTReader somehow failed.
     * @throws JsonProcessingException JsonParser somehow failed.
     */
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
