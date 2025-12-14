package home.fileserver.repositories;

import com.webauthn4j.data.client.challenge.Challenge;
import com.webauthn4j.data.client.challenge.DefaultChallenge;
import org.jspecify.annotations.Nullable;
import org.springframework.security.web.webauthn.api.PublicKeyCredentialCreationOptions;
import org.springframework.security.web.webauthn.registration.HttpSessionPublicKeyCredentialCreationOptionsRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;


public class CustomPublicKeyCredentialCreationOptionsRepository extends HttpSessionPublicKeyCredentialCreationOptionsRepository{
    @Override
    public @Nullable PublicKeyCredentialCreationOptions load(HttpServletRequest request) {
        var creOpt = super.load(request);
      HttpSession session = request.getSession();

        PublicKeyCredentialCreationOptions.PublicKeyCredentialCreationOptionsBuilder(
      return session == null ? new DefaultChallenge().getValue() : (PublicKeyCredentialCreationOptions)session.getAttribute(session.getId());
   }
}
