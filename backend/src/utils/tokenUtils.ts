import { decode, verify } from "jsonwebtoken";
import { JwtPayload } from "src/models/auth/Jwt";
import { createLogger } from "./logger";
import axios from "axios";
import {APIGatewayProxyEventHeaders } from "aws-lambda";

const jwksUrl = process.env.AUTH_0_JWKS_URL;
const logger = createLogger("auth");
/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function getUserId(headers: APIGatewayProxyEventHeaders): string {
  var jwtToken = getToken(headers.Authorization);
  const decodedJwt = decode(jwtToken) as JwtPayload;
  return decodedJwt.sub;
}

/**
 * Parse a JWT token
 * @param jwtToken JWT token to parse
 * @returns JWT token
 */
export function getToken(authHeader: string): string {
  if (!authHeader) throw new Error("No authentication header");

  if (!authHeader.toLowerCase().startsWith("bearer "))
    throw new Error("Invalid authentication header");

  const split = authHeader.split(" ");
  const token = split[1];

  return token;
}

export async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader);
  const key = await getSigningKey(token);

  try {
    return verify(token, key, { algorithms: ["RS256"] }) as JwtPayload;
  } catch (e) {
    logger.error("User not authorized", { error: e.message });
  }
}

async function getSigningKey(jwt: string) {
  const jwksRequest = await axios.get<any>(jwksUrl);
  const decodedJwt = decode(jwt, { complete: true });
  const jwk = jwksRequest.data.keys.find(
    (key) => key.kid === decodedJwt.header.kid
  );
  return certToPEM(jwk.x5c[0]);
}

function certToPEM(cert: string) {
  cert = cert.match(/.{1,64}/g).join("\n");
  cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;
  return cert;
}
