package org.apx.domain.model.converters;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apx.beans.ApplicationContextHolder;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.io.IOException;
import java.util.HashMap;

/**
 * Created by oleg on 02.04.2015.
 */
@Converter
public class MapToStringConverter implements AttributeConverter<HashMap<String, Object>, String> {

    @Override
    public String convertToDatabaseColumn(HashMap<String, Object> field) {
        ObjectMapper om = (ObjectMapper) ApplicationContextHolder.context().getBean("halObjectMapper");
        String result = "{}";
        if (field != null) {
            try {
                result = om.writeValueAsString(field);
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        }
        return result;
    }

    @Override
    public HashMap<String, Object> convertToEntityAttribute(String json) {
        ObjectMapper om = (ObjectMapper) ApplicationContextHolder.context().getBean("halObjectMapper");
        HashMap<String, Object> map = new HashMap<String, Object>();
        if (json != null) {
            try {
                map = om.readValue(json, new TypeReference<HashMap<String, Object>>() {
                });
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return map;
    }
}
