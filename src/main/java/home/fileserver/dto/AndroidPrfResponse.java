package home.fileserver.dto;

import java.io.Serializable;

import org.springframework.security.web.webauthn.api.AuthenticationExtensionsClientOutput;
import org.springframework.security.web.webauthn.api.Bytes;

public class AndroidPrfResponse implements AuthenticationExtensionsClientOutput<AndroidPrfResponse.Prf> {
   public static final String EXTENSION_ID = "prf";
   private final Prf output;

   public AndroidPrfResponse(boolean enabled, AndroidPrfResponse.Prf.Results results) {
      this.output = new Prf(enabled, results);
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
      private final Results results;

      public static class Results implements Serializable {
         private final Bytes first;

         public Results (String first) {
            this.first = Bytes.fromBase64(first);
         }
      }

      private Prf(boolean enabled, Results results) {
         this.enabled = enabled;
         this.results = results;
      }

      public boolean isEnabled() {
         return this.enabled;
      }

      public Results getResults() {
         return this.results;
      }
   }
}
