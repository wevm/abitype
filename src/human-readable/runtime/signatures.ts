export const structSignatureRegex =
  /^struct\s(?<name>[a-zA-Z0-9_]+)\s\{(?<properties>.*?)\}$/
export function isStructSignature(signature: string) {
  return structSignatureRegex.test(signature)
}
