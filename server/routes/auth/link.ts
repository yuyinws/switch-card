import { withQuery } from 'ufo'
import { calculateChallenge, generateRandom } from '~/utils/auth'
import { CLIENT_ID } from '~/utils/constance'

export default defineEventHandler(() => {
  const codeVerifier = generateRandom(32)
  const codeChallenge = calculateChallenge(codeVerifier)

  const linkParams = {
    state: '',
    redirect_uri: `npf${CLIENT_ID}://auth`,
    client_id: CLIENT_ID,
    scope: 'openid user user.mii user.email user.links[].id',
    response_type: 'session_token_code',
    session_token_code_challenge: codeChallenge,
    session_token_code_challenge_method: 'S256',
    theme: 'login_form',
  }

  const link = withQuery('https://accounts.nintendo.com/connect/1.0.0/authorize', linkParams)
  return {
    link,
    codeVerifier,
  }
})
