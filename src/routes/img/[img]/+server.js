import { backend, backendProxy } from '../../../lib/db/db.js';

import { readFile, writeFile } from 'node:fs/promises';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, cookies, params }) {
    var imgName = params['img'];

    imgName = imgName.replace(/(\s+)/g, '\\$1');

    var res = await readFile(`${process.cwd()}/db/post-${imgName}`);

    return new Response(res);
}
