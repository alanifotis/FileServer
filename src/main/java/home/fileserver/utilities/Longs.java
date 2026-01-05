package home.fileserver.utilities;

import org.springframework.security.web.webauthn.api.Bytes;
import org.springframework.stereotype.Component;

@Component
public final class Longs {
    public static final int BYTES = Long.BYTES;

    public static Bytes toBytes(long value) {
    byte[] result = new byte[8];
    for (int i = 7; i >= 0; i--) {
      result[i] = (byte) (value & 0xffL);
      value >>= 8;
    }
    return new Bytes(result);
  }

  public static long fromBytes(Bytes id) {

    byte[] bytes = id.getBytes();

    if (bytes.length < BYTES) {
        throw new IllegalArgumentException(String.format("array too small: %s < %s", bytes.length, BYTES));
    }
    return fromBytes(
        bytes[0], bytes[1], bytes[2], bytes[3], bytes[4], bytes[5], bytes[6], bytes[7]);

  }

  public static long fromBytes(
      byte b1, byte b2, byte b3, byte b4, byte b5, byte b6, byte b7, byte b8) {
    return (b1 & 0xFFL) << 56
        | (b2 & 0xFFL) << 48
        | (b3 & 0xFFL) << 40
        | (b4 & 0xFFL) << 32
        | (b5 & 0xFFL) << 24
        | (b6 & 0xFFL) << 16
        | (b7 & 0xFFL) << 8
        | (b8 & 0xFFL);
  }
}
