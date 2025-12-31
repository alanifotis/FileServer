package home.fileserver.models;

import org.springframework.security.web.webauthn.api.AuthenticationExtensionsClientInput;
import java.io.Serializable;

// 1. Change generic to the new wrapper class: PrfClientInputExtension
public class PrfAuthenticationExtensionsClientInput implements AuthenticationExtensionsClientInput<PrfAuthenticationExtensionsClientInput.PrfClientInputExtension> {

    private final PrfClientInputExtension input;

    // Constructor accepts the inner values for convenience, but wraps them immediately
    public PrfAuthenticationExtensionsClientInput(Eval values) {
        this.input = new PrfClientInputExtension(values);
    }

    @Override
    public String getExtensionId() {
        return "prf";
    }

    @Override
    public PrfClientInputExtension getInput() {
        return this.input;
    }

    // --- Layer 1: The Wrapper (Creates the "eval" key) ---
    public static class PrfClientInputExtension implements Serializable {
        private final Eval eval;

        public PrfClientInputExtension(Eval eval) {
            this.eval = eval;
        }

        // This getter name generates the "eval" JSON key
        public Eval getEval() {
            return eval;
        }
    }

    // --- Layer 2: The Values (Creates the "first" key) ---
    public static class Eval implements Serializable {
        private static final String first = "";

        public Eval() {}

        public String getFirst() {
            return first;
        }
    }
}