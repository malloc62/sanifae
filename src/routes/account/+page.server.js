import { checkLength, checkRegex } from '../../lib/util.js';
import { registerBackend, loginBackend } from '../../lib/db.js';

async function basicChecks(data) {
  const pass = data.get('pass') + '';
  const user = data.get('user') + '';

  var lengthCheck = false;

  lengthCheck = 
    checkLength(pass,'Password',4,1024) ||
    checkLength(user,'Username',1,64) ||
    checkRegex(user,'Username',/[^A-Za-z0-9\-\_]/g);

  return {
    user,
    pass,
    lengthCheck
  };
}

/** @type {import('./$types').Actions} */
export const actions = {
  register: async ({ request }) => {
    const data = await request.formData();

    const pass2 = data.get('pass2') + '';

    var {lengthCheck, user, pass} = await basicChecks(data);

    if (lengthCheck)
      return lengthCheck;

    if (pass != pass2)
      return { success: 'Failed to confirm password.' };
    
    return await registerBackend({ user, pass });
  },

  login: async ({ request, cookies }) => {
    const data = await request.formData();

    var {lengthCheck, user, pass} = await basicChecks(data);

    if (lengthCheck)
      return lengthCheck;
    
    var result = await loginBackend({ user, pass });

    if (result.token) {
      cookies.set('token',result.token, {
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
      });
    }

    return result;
  }
};