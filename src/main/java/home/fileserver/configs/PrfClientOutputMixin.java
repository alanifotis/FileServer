package home.fileserver.configs;

import org.springframework.security.web.webauthn.api.Bytes;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import home.fileserver.dto.PrfClientOutput;

/**
 * Jackson Mixin for PrfClientOutput and its inner classes.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
abstract class PrfClientOutputMixin {

    @JsonCreator
    PrfClientOutputMixin(
            @JsonProperty("enabled") boolean enabled,
            @JsonProperty("results") PrfClientOutput.Prf.Results results) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)

    abstract static class PrfMixin {
        @JsonCreator
        PrfMixin(
                @JsonProperty("enabled") boolean enabled,
                @JsonProperty("results") PrfClientOutput.Prf.Results results) {
        }
    }

    // Updated: Ignore nulls to keep JSON clean
    @JsonIgnoreProperties(ignoreUnknown = true)
    @JsonInclude(JsonInclude.Include.NON_NULL)

    abstract static class ResultsMixin {
        @JsonCreator
        ResultsMixin(
                @JsonProperty("first") Bytes first,
                @JsonProperty("second") Bytes second) {
        }
    }
}