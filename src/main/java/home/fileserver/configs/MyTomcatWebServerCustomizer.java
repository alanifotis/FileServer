package home.fileserver.configs;

import org.apache.catalina.connector.Connector;
import org.apache.coyote.UpgradeProtocol;
import org.apache.coyote.http2.Http2Protocol;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.tomcat.servlet.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.stereotype.Component;

@Component
public class MyTomcatWebServerCustomizer implements WebServerFactoryCustomizer<TomcatServletWebServerFactory> {

  @Value("${server.port}")
  private int httpsPort;

  @Value("${server.http.port}")
  private int httpPort;

  @Override
  public void customize(TomcatServletWebServerFactory factory) {

    factory.addConnectorCustomizers((Connector connector) -> {
      connector.setMaxPostSize(524288000); 
      connector.setProperty("maxHttpFormPostSize", "524288000");
      connector.setProperty("useAsyncIO", "false");

      for (UpgradeProtocol upgradeProtocol : connector.findUpgradeProtocols()) {
        if (upgradeProtocol instanceof Http2Protocol http2Protocol) {
          http2Protocol.setReadTimeout(120000);
          http2Protocol.setWriteTimeout(120000);
          
        }
      }
    });

    Connector httpConnector = new Connector(TomcatServletWebServerFactory.DEFAULT_PROTOCOL);
    httpConnector.setPort(this.httpPort);
    httpConnector.setScheme("http");
    httpConnector.setSecure(false);
    httpConnector.setRedirectPort(this.httpsPort);
    factory.addAdditionalConnectors(httpConnector);
  }
}