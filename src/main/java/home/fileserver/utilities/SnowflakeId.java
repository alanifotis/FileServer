package home.fileserver.utilities;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.lang.annotation.ElementType;

import org.hibernate.annotations.IdGeneratorType;

@IdGeneratorType(SnowflakeGenerator.class)
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD, ElementType.FIELD})
public @interface SnowflakeId {
    // You can add configuration here later if needed (e.g., specific nodeId)
}