import { tokenBackend, postCreateBackend } from '../../lib/db.js';
import { checkLength, checkRegex } from '../../lib/util.js';

/** @type {import('./$types').Actions} */
export const actions = {
    create: async ({ request, cookies }) => {
        
        var user = await tokenBackend({
            token: cookies.get('token') 
        });

        if (!user)
            return {'success': 'Not logged in.'}

        const data = await request.formData();
        const content = data.get('content') + '';

        var lengthCheck = checkLength(content,'Post content',1,10240);

        if (lengthCheck)
            return lengthCheck;

        await postCreateBackend({user, content});

        return {'success': 'Successfully posted.'};
    }
};