package home.fileserver.models;

import org.springframework.security.web.webauthn.api.AuthenticationExtensionsClientInput;
import org.springframework.security.web.webauthn.api.Bytes;

import java.io.Serializable;

// 1. Change generic to the new wrapper class: PrfContainer
public class PrfAuthenticationExtensionsClientInput implements AuthenticationExtensionsClientInput<PrfAuthenticationExtensionsClientInput.PrfContainer> {

    private final PrfContainer container;

    // Constructor accepts the inner values for convenience, but wraps them immediately
    public PrfAuthenticationExtensionsClientInput(PrfValues values) {
        this.container = new PrfContainer(values);
    }

    @Override
    public String getExtensionId() {
        return "prf";
    }

    @Override
    public PrfContainer getInput() {
        return this.container;
    }

    // --- Layer 1: The Wrapper (Creates the "eval" key) ---
    public static class PrfContainer implements Serializable {
        private final PrfValues eval;

        public PrfContainer(PrfValues eval) {
            this.eval = eval;
        }

        // This getter name generates the "eval" JSON key
        public PrfValues getEval() {
            return eval;
        }
    }

    // --- Layer 2: The Values (Creates the "first" key) ---
    public static class PrfValues implements Serializable {
        private final Bytes first;

        public PrfValues(Bytes first) {
            this.first = first;
        }

        public PrfValues(byte[] first) {
            this.first = new Bytes(first);
        }

        public Bytes getFirst() {
            return first;
        }
    }
}