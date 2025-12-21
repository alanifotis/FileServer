package home.fileserver.repositories;

//
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import jakarta.servlet.http.HttpSession;
//import lombok.extern.log4j.Log4j2;
//
//import org.springframework.security.jackson.SecurityJacksonModules;
//import org.springframework.security.web.webauthn.api.PublicKeyCredentialCreationOptions;
//import org.springframework.security.web.webauthn.jackson.WebauthnJacksonModule;
//import org.springframework.security.web.webauthn.registration.PublicKeyCredentialCreationOptionsRepository;
//import org.springframework.stereotype.Component;
//
//import tools.jackson.databind.ObjectMapper;
//import tools.jackson.databind.annotation.JsonDeserialize;
//import tools.jackson.databind.annotation.JsonPOJOBuilder;
//import tools.jackson.databind.json.JsonMapper;
//import tools.jackson.core.JacksonException;
//
//@Log4j2
//@Component
//public class JsonSessionRepository implements PublicKeyCredentialCreationOptionsRepository {
//    // 1. Define a Mixin that tells Jackson to use the Builder
//    @JsonDeserialize(builder = PublicKeyCredentialCreationOptions.PublicKeyCredentialCreationOptionsBuilder.class)
//    public abstract static class CustomCreationOptionsMixin {}
//
//    // 2. Define a Mixin for the Builder to handle the "set" prefix
//    // (Spring Security builders usually use setX, Jackson defaults to withX)
//    @JsonPOJOBuilder(withPrefix = "set")
//    public abstract static class CustomBuilderMixin {}
//
//    private final ObjectMapper converter;
//    private static final String SESSION_ATTR = "WEBAUTHN_CREATION_OPTIONS";
//
//    public JsonSessionRepository() {
//        this.converter = JsonMapper.builder()
//                // Load the official module (it handles Bytes, RpEntity, etc. correctly)
//                .addModule(new WebauthnJacksonModule())
//
//                // OVERRIDE the broken/empty Mixin for the main class
//                .addMixIn(PublicKeyCredentialCreationOptions.class, CustomCreationOptionsMixin.class)
//
//                // Register the Builder Mixin
//                .addMixIn(PublicKeyCredentialCreationOptions.PublicKeyCredentialCreationOptionsBuilder.class, CustomBuilderMixin.class)
//                .build();
//    }
//
//
//    @Override
//    public void save(HttpServletRequest request, HttpServletResponse response, PublicKeyCredentialCreationOptions options) {
//        HttpSession session = request.getSession();
//        if (options == null) {
//            session.removeAttribute(SESSION_ATTR);
//            return;
//        }
//
//        // FIX: We convert to String because String is Serializable.
//        // The raw 'options' object is NOT Serializable and crashes DefaultSerializer.
//
//        String json = converter.writeValueAsString(options);
//
//        log.info("Serialized JSON: {}",json);
//
//        session.setAttribute(SESSION_ATTR, json);
//    }
//
//    @Override
//    public PublicKeyCredentialCreationOptions load(HttpServletRequest request) {
//        HttpSession session = request.getSession(false);
//        if (session == null || session.getAttribute(SESSION_ATTR) == null) {
//            return null;
//        }
//        String json = (String) session.getAttribute(SESSION_ATTR);
//        try {
//            return converter.readValue(json, PublicKeyCredentialCreationOptions.class);
//        } catch (JacksonException e) {
//            log.error("Here went wrong", e);
//            return null;
//        }
//    }
//}