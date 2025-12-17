package home.fileserver.repositories;


import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.web.webauthn.api.PublicKeyCredentialCreationOptions;
import org.springframework.security.web.webauthn.registration.PublicKeyCredentialCreationOptionsRepository;

import tools.jackson.databind.ObjectMapper;

public class JsonSessionRepository implements PublicKeyCredentialCreationOptionsRepository {

    private static final String SESSION_ATTR = "WEBAUTHN_CREATION_OPTIONS";
    private final ObjectMapper mapper;

    public JsonSessionRepository(ObjectMapper mapper) {
        this.mapper = mapper;
    }

    @Override
    public void save(HttpServletRequest request, HttpServletResponse response, PublicKeyCredentialCreationOptions options) {
        HttpSession session = request.getSession();
        if (options == null) {
            session.removeAttribute(SESSION_ATTR);
            return;
        }
        // FIX: We convert to String because String is Serializable. 
        // The raw 'options' object is NOT Serializable and crashes DefaultSerializer.
        String json = mapper.writeValueAsString(options);
        session.setAttribute(SESSION_ATTR, json);
    }

    @Override
    public PublicKeyCredentialCreationOptions load(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute(SESSION_ATTR) == null) {
            return null;
        }
        String json = (String) session.getAttribute(SESSION_ATTR);
        return mapper.readValue(json, PublicKeyCredentialCreationOptions.class);
    }
}