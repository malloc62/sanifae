const rowCount = 5;

import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { hash, compare } from 'bcrypt'
import { calcVote } from './util.js';
import { checkLength, checkRegex } from './util.js';

const {
    randomBytes
} = await import('node:crypto');

var db;
async function initDb() {
    db = await open({
      filename: `${process.cwd()}/db/main.db`,
      driver: sqlite3.Database
    });

    await db.run('CREATE TABLE IF NOT EXISTS auth (username CHAR(64), password CHAR(1024))');
    await db.run('CREATE TABLE IF NOT EXISTS token (username CHAR(64), token CHAR(1024))');
    await db.run('CREATE TABLE IF NOT EXISTS post (username CHAR(64), id CHAR(64), content CHAR(10240), upvotes INTEGER, downvotes INTEGER, rating REAL)');
    await db.run('CREATE TABLE IF NOT EXISTS vote (id CHAR(64), username CHAR(64), type INTEGER)');  
}

var backend = {};

backend.register = async ({user, pass, pass2}) => {
    var lengthCheck = false;

    lengthCheck = 
      checkLength(pass,'Password',4,1024) ||
      checkLength(user,'Username',1,64) ||
      checkRegex(user,'Username',/[^A-Za-z0-9\-\_]/g);

    if (lengthCheck) return lengthCheck;

    if (pass != pass2) return {'success': 'Passwords don\'t match.'};
    
    if (!db) await initDb();

    var existingAccounts = await db.all('SELECT username FROM auth WHERE username = ?',[
        user
    ]);

    if (existingAccounts && existingAccounts.length > 0)
        return { success: 'Account already exists.' };

    var passHash = await hash(pass,10);

    await db.run('INSERT INTO auth (username, password) VALUES (?, ?)', [
        user,
        passHash
    ])

    return { success: 'Successfully created account.', location: '/'};
}

backend.login = async ({user, pass, cookies}) => {
    if (!db) await initDb();

    var existingAccounts = await db.all('SELECT username, password FROM auth WHERE username = ?',[
        user
    ]);

    if (!existingAccounts || existingAccounts.length < 1)
        return { success: 'Account does not exist.' };

    var passHash = await compare(pass,existingAccounts[0].password);

    if (!passHash) 
        return { success: 'Incorrect password.' };

    var token = randomBytes(256).toString('hex');

    await db.run('INSERT INTO token (username, token) VALUES (?, ?)', [
        user,
        token
    ])

    if (token) {
        cookies.set('token',token, {
          maxAge: 60 * 60 * 24 * 7,
          path: '/'
        });
    };

    return { success: 'Successfully logged into account.', data: token, location: '/'};
}

backend.postCreate = async ({cookies, content}) => {
    if (!db) await initDb();

    var lengthCheck = checkLength(content,'Post content',1,10240);

    if (lengthCheck)
        return lengthCheck;

    var user = (await backend.token({cookies})).data;

    if (!user || !content || user == '') return {'success': 'Not authorized.' };

    var id = randomBytes(10).toString('hex');

    await db.run('INSERT INTO post (username, id, content, rating) VALUES (?, ?, ?, ?)', [
        user,
        id,
        content,
        calcVote(0,0)
    ])

    return {'success': 'Your post has been broadcasted!' };
}

backend.postGet = async ({id}) => {
    if (!db) await initDb();

    var posts = await db.all('SELECT * from post WHERE id = ?', [
        id
    ])

    if (!posts || posts.length < 1) {
        return {'success': 'Post does not exist.'}
    }

    return {data: posts[0]};
}

backend.postBulk = async ({page}) => {
    if (!db) await initDb();

    var posts = await db.all('SELECT * from post ORDER BY rating DESC LIMIT ?, ?', [
        page*rowCount,
        rowCount
    ])

    return {data: posts};
}

backend.vote = async ({cookies, id, vote}) => {
    if (!db) await initDb();

    var user = (await backend.token({cookies})).data;

    if (!user || !id || user == '' || (vote != 'down' && vote != 'up')) return {success: 'fail' };

    await db.run('DELETE FROM vote WHERE username = ? AND id = ?', [
        user,
        id
    ]);

    await db.run('INSERT INTO vote (id, username, type) VALUES (?,?,?)', [
        id,
        user,
        vote == 'up' ? 1 : 2
    ]);

    var votes = await db.all('SELECT type from vote WHERE id = ?', [
        id
    ]) || [];

    var up = votes.filter(x => x.type == 1).length;
    var down = votes.filter(x => x.type == 2).length;

    await db.run('UPDATE post SET upvotes = ?, downvotes = ?, rating = ? WHERE id = ?', [
        up,
        down,
        calcVote(up,down),
        id
    ]);

    return {data: {up,down}};
}

backend.token = async ({cookies}) => {
    if (!db) await initDb();

    var tokenIn = cookies.get('token');

    var existingAccounts = await db.all('SELECT username from token WHERE token = ?',[
        tokenIn
    ]);
    
    if (!existingAccounts || existingAccounts.length < 1)
        return false;

    return {data: existingAccounts[0].username};
}

export {
    backend
}