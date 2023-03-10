import { backend } from './handlers.js';

const AUTH_ACTIONS = [
    'postCreate',
    'fileCreate',
    'vote',
    'postDelete',
    'pfp',
    'follow'
];

import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

var db;

async function initDb() {
    db = await open({
      filename: `${process.cwd()}/db/main.db`,
      driver: sqlite3.Database
    });

    await db.run('CREATE TABLE IF NOT EXISTS auth (username CHAR(64), password CHAR(1024))');
    await db.run('CREATE TABLE IF NOT EXISTS token (username CHAR(64), token CHAR(1024))');
    await db.run('CREATE TABLE IF NOT EXISTS post (username CHAR(64), id CHAR(64), content CHAR(10240), upvotes INTEGER, downvotes INTEGER, rating REAL, reply CHAR(64), time INTEGER)');
    await db.run('CREATE TABLE IF NOT EXISTS vote (id CHAR(64), username CHAR(64), type INTEGER)');  
    await db.run('CREATE TABLE IF NOT EXISTS user (username CHAR(64), followers INTEGER, following INTEGER, upvotes INTEGER, downvotes INTEGER, reputation REAL)'); 
    await db.run('CREATE TABLE IF NOT EXISTS bio (username CHAR(64), content CHAR(10240), roles INTEGER)');
    await db.run('CREATE TABLE IF NOT EXISTS follow (username CHAR(64), following CHAR(64))');  
}

let backendProxy = async ({route, backendParams}) => {
    if (!db) await initDb();

    let extraParams = {};

    extraParams['db'] = db;

    let user = (await backend.token({cookies: backendParams.cookies},extraParams)) || {};

    user = user.data;
    
    if ((!user || user == '') && AUTH_ACTIONS.indexOf(route) != -1) return {'success': 'Not authorized.' };
3
    let isAdmin = false; 
    if (user && user != '') isAdmin = ((await backend.userRoles({}, {user, db})) || []).indexOf('Admin') != -1;

    extraParams['admin'] = isAdmin;
    extraParams['user'] = user;

    return backend[route](backendParams, extraParams) || {};
}

export {
    backendProxy
};