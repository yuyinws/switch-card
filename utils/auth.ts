import { createHash, randomBytes } from 'node:crypto'
import base64url from 'base64url'

export function generateRandom(length: number) {
  return base64url(randomBytes(length))
}

export function calculateChallenge(codeVerifier: string) {
  const hash = createHash('sha256')
  hash.update(codeVerifier)
  const codeChallenge = base64url(hash.digest())
  return codeChallenge
}
