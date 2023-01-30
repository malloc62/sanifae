import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { hash, compare } from 'bcrypt'

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
    await db.run('CREATE TABLE IF NOT EXISTS post (username CHAR(64), id CHAR(64), content CHAR(10240), upvotes INTEGER, downvotes INTEGER)');
    await db.run('CREATE TABLE IF NOT EXISTS vote (id CHAR(64), username CHAR(64), type INTEGER)');  
}

async function registerBackend({user, pass}) {
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

    return { success: 'Successfully created account.' };
}

async function loginBackend({user, pass}) {
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

    return { success: 'Successfully logged into account.', token };
}

async function postCreateBackend({user, content}) {
    var id = randomBytes(10).toString('hex');

    await db.run('INSERT INTO post (username, id, content) VALUES (?, ?, ?)', [
        user,
        id,
        content
    ])
}

async function postGetBackend({id}) {
    var posts = await db.all('SELECT * from post WHERE id = ?', [
        id
    ])

    if (!posts || posts.length < 1) {
        return {'success': 'Post does not exist.'}
    }

    return posts[0];
}

async function tokenBackend({token}) {
    if (!db) await initDb();

    var existingAccounts = await db.all('SELECT username from token WHERE token = ?',[
        token
    ]);
    
    if (!existingAccounts || existingAccounts.length < 1)
        return false;

    return existingAccounts[0].username;
}

export {
    registerBackend,
    loginBackend,
    tokenBackend,
    postCreateBackend,
    postGetBackend
}