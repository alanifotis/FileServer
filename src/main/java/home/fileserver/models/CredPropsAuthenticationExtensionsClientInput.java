package home.fileserver.models;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonValue;
import org.springframework.security.web.webauthn.api.AuthenticationExtensionsClientInput;

import java.io.Serializable;

public class CredPropsAuthenticationExtensionsClientInput implements AuthenticationExtensionsClientInput<CredPropsAuthenticationExtensionsClientInput.CredProps> {
    private static final CredProps credProps = new CredProps();

    public CredPropsAuthenticationExtensionsClientInput() {}

    @Override
    @JsonIgnore
    public String getExtensionId() {
        return "credProps";
    }

    @Override
    public CredProps getInput() {
        return CredPropsAuthenticationExtensionsClientInput.credProps;
    }

    public static class CredProps implements Serializable {
        private final boolean credProps = true;

        public CredProps() {}

        @JsonValue
        public boolean getCredProps() {
            return this.credProps;
        }
    }
}