package home.fileserver.models;

import java.util.Map;

import org.springframework.security.web.webauthn.api.Bytes;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

// This ensures null fields (like "second") are ignored, keeping the JSON clean
@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
@Setter
public class AuthenticationExtensionsPrfInputs {

    /**
     * "eval": used when you know the credential ID or during registration
     * to derive a specific key immediately.
     */
    @JsonProperty("eval")
    private PrfValues eval;

    /**
     * "evalByCredential": used during authentication when you don't know 
     * which passkey the user will select yet.
     */
    @JsonProperty("evalByCredential")
    private Map<String, PrfValues> evalByCredential;

    // Constructors
    public AuthenticationExtensionsPrfInputs() {}

    public AuthenticationExtensionsPrfInputs(PrfValues eval) {
        this.eval = eval;
    }

    // Inner class for the actual salt values
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @Getter
    @Setter
    public static class PrfValues {
        
        @JsonProperty("first")
        private Bytes first;

        @JsonProperty("second")
        private Bytes second;

        public PrfValues(Bytes first) {
            this.first = first;
        }

        public PrfValues(Bytes first, Bytes second) {
            this.first = first;
            this.second = second;
        }
        
    }
    
}