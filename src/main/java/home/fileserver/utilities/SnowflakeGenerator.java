package home.fileserver.utilities;

import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.generator.BeforeExecutionGenerator;
import org.hibernate.generator.EventType;
import org.hibernate.generator.GeneratorCreationContext;
import java.lang.reflect.Member;
import java.util.EnumSet;

public class SnowflakeGenerator implements BeforeExecutionGenerator {

    // 1. Constructor required by Hibernate 6
    // It accepts the annotation instance, the field member, and context.
    public SnowflakeGenerator(SnowflakeId config, Member member, GeneratorCreationContext context) {
        // If your annotation had settings (like @SnowflakeId(node=1)), 
        // you would read them from 'config' here.
    }

    // 2. The logic to create the ID
    @Override
    public Object generate(SharedSessionContractImplementor session, Object owner, Object currentValue, EventType eventType) {
        // Calls your thread-safe Singleton
        return Snowflake.getInstance().nextId();
    }

    // 3. Define when this generator runs (On Insert)
    @Override
    public EnumSet<EventType> getEventTypes() {
        return EnumSet.of(EventType.INSERT);
    }
}