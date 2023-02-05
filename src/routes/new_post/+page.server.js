import { backend } from '../../lib/db/db.js';
import { checkLength, checkRegex } from '../../lib/util.js';

/** @type {import('./$types').Actions} */
export const actions = {
    create: async ({ request, cookies }) => {
        const data = await request.formData();
        const content = data.get('content') + '';

        var lengthCheck = checkLength(content,'Post content',1,10240);

        if (lengthCheck)
            return lengthCheck;

        await backend.postCreate({user, content});

        return {'success': 'Successfully posted.'};
    }
};