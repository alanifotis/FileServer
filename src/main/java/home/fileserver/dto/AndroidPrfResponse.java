package home.fileserver.dto;

import java.io.Serializable;

import org.springframework.security.web.webauthn.api.AuthenticationExtensionsClientOutput;

public class AndroidPrfResponse implements AuthenticationExtensionsClientOutput<AndroidPrfResponse.Prf> {
    public static final String EXTENSION_ID = "prf";
    private final Prf output;


    public AndroidPrfResponse(boolean enabled) {
        this.output = new Prf(enabled);
    }

    @Override
    public String getExtensionId() {
        return "prf";
    }

    @Override
    public Prf getOutput() {
      return this.output;
   }

    public static final class Prf implements Serializable {
      private final boolean enabled;

      private Prf(boolean enabled) {
         this.enabled = enabled;
      }

      public boolean isEnabled() {
         return this.enabled;
      }
   }
}
