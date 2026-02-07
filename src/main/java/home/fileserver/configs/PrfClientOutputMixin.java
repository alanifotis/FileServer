package home.fileserver.configs;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import home.fileserver.dto.PrfClientOutput.Prf;


@JsonAutoDetect(
    fieldVisibility = JsonAutoDetect.Visibility.ANY, 
    getterVisibility = JsonAutoDetect.Visibility.NONE, 
    isGetterVisibility = JsonAutoDetect.Visibility.NONE
)
@JsonIgnoreProperties(ignoreUnknown = true)
abstract class PrfClientOutputMixin {

    @JsonProperty("prf")
    abstract Prf getOutput();

    abstract String getExtensionId();

    abstract static class PrfMixin {
        @JsonProperty("enabled")
        abstract boolean getEnabled();

        @JsonProperty("results")
        abstract Prf.Results getResults();
    }

    abstract static class ResultsMixin {
        @JsonProperty("first")
        abstract Object getFirst();

        @JsonProperty("second")
        abstract Object getSecond();
    }
}