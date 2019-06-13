package pl.gdansk.skpt.MapCreatorREST.Util;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.vividsolutions.jts.geom.Point;
import com.vividsolutions.jts.io.WKTWriter;
import java.io.IOException;

/**
 * Helper class for geographic point JSON serialization.
 */
public class PointToJsonSerializer extends JsonSerializer<Point> {

    @Override
    public void serialize(Point point, JsonGenerator jgen,
                          SerializerProvider provider) throws IOException,
            JsonProcessingException {

        StringBuilder pointsAsJSON = new StringBuilder("");
        try
        {
            pointsAsJSON.append(new WKTWriter().write(point));
            pointsAsJSON.append(";");

        }
        catch(Exception e) {
            e.printStackTrace();
        }

        jgen.writeString(pointsAsJSON.toString());
    }

}
