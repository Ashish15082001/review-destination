import getSignature from "./getSignature";

interface VerifySignatureParams {
  value: string;
  signature: string;
}

export default function verifySignature({
  value,
  signature,
}: VerifySignatureParams): boolean {
  return getSignature(value) === signature;
}
