import { backend, backendProxy } from '../../../lib/db/db.js';

import { readFile, writeFile } from 'node:fs/promises';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, cookies, params }) {
    var imgName = params['img'];

    imgName = imgName.replace(/(\s+)/g, '\\$1');

    var res = await readFile(`${process.cwd()}/db/post-${imgName}`);

    var response = new Response(res);
    var extension = imgName.split('.').pop();

    if (extension == 'svg') {
        response = new Response(res, {'headers': {
            'Content-Type':  'image/svg+xml'
        }});
    }
    return response;
}
