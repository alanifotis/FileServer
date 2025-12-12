package home.fileserver.dto;

public class RegistrationRequest {
    public PublicKeyPayload publicKey;

    public static class PublicKeyPayload {
        public CredentialData credential;
        public String label;
    }

    public static class CredentialData {
        public String id;
        public String rawId;
        public String type;
        public ResponseData response;
        public ClientExtensionResults clientExtensionResults;
    }

    public static class ResponseData {
        public String attestationObject;
        public String clientDataJSON;
        public String transports; // simplified, might be array
    }
    
    public static class ClientExtensionResults {
        // We can map PRF results here if needed later
        public boolean credProps; 
    }
}