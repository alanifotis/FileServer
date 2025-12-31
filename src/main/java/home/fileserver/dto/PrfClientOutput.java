package home.fileserver.dto;

import java.io.Serializable;

import org.jspecify.annotations.Nullable;
import org.springframework.security.web.webauthn.api.AuthenticationExtensionsClientOutput;
import org.springframework.security.web.webauthn.api.Bytes;

public class PrfClientOutput implements AuthenticationExtensionsClientOutput<PrfClientOutput.Prf> {
   public static final String EXTENSION_ID = "prf";
   private final Prf output;

   public PrfClientOutput(boolean enabled, PrfClientOutput.Prf.Results results) {
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
      @Nullable private final Results results;

      public Prf(boolean enabled, Results results) {
         this.enabled = enabled;
         this.results = results;
      }

      public Prf(boolean enabled) {
         this.enabled = enabled;
         this.results = null;
      }

      public boolean getEnabled() {
         return this.enabled;
      }

      public Results getResults() {
         return this.results;
      }

      public static class Results implements Serializable {
         @Nullable private final Bytes first;
         @Nullable private final Bytes second;

         public Results (Bytes first) {
            this.first = first;
            this.second = null;
         }

         public Results (Bytes first, Bytes second) {
            this.first = first;
            this.second = second;
         }

         public Results () {
            this.first = null;
            this.second = null;
         }

         public Bytes getFirst() {
            return this.first;
         }

         public Bytes getSecond() {
            return this.second;
         }
      }

   }
}
