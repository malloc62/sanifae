import { VALID_EXTENSIONS } from '../../../lib/db/db.js';

import { readFile } from 'node:fs/promises';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, cookies, params }) {
    var imgName = params['img'];

    imgName = imgName.replace(/(\s+)/g, '\\$1');

    var res;

    var res = await readFile(`${process.cwd()}/db/pfp-${imgName}`);

    var response = new Response(res);
    var extension = imgName.split('.').pop();

    if (extension == 'svg') {
        response = new Response(res, {'headers': {
            'Content-Type':  'image/png'
        }});
    }
    return response;
}
