const ROW_COUNT = 5;

const AUTH_ACTIONS = [
    'postCreate',
    'fileCreate',
    'vote',
    'postDelete',
    'pfp',
    'follow'
];

const LEGAL_SORTS = [
    'time',
    'rating'
]

const FILE_SIZE_LIMIT = 1024*1024*16;

const VALID_EXTENSIONS = ['png','jpg','jpeg','gif','svg', 'mp4'];

var ridArray = {};

import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { hash, compare } from 'bcrypt'
import { randomBytes, createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { calcVote, checkLength, checkRegex, safePath, formatPost } from '../util.js';

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

    if (AUTH_ACTIONS.indexOf(route) != -1) {
        var user = (await backend.token({cookies: backendParams.cookies})).data;
        if (!user || user == '') return {'success': 'Not authorized.' };

        backendParams['user'] = user;
    }

    return backend[route](backendParams);
}

var backend = {};

let updateUser = async ({user}) => {
    let allPosts = await db.all('SELECT * from post WHERE username = ?', [
        user
    ]);

    let upvotes = 0;
    let downvotes = 0;
    allPosts.forEach(post => {
        upvotes += post.upvotes || 0;
        downvotes += post.downvotes || 0;
    });

    await db.run('DELETE FROM user WHERE username = ?', [
        user
    ]);

    await db.run('INSERT INTO user (username,followers,following,upvotes,downvotes,reputation) VALUES (?,?,?,?,?,?)', [
        user,
        0,
        0,
        upvotes,
        downvotes,
        calcVote(upvotes,downvotes,'user')
    ]);
}

backend.register = async ({user, pass, pass2}) => {
    var lengthCheck = false;

    lengthCheck = 
      checkLength(pass,'Password',4,1024) ||
      checkLength(user,'Username',1,64) ||
      checkRegex(user,'Username',/[^A-Za-z0-9\-\_]/g);

    if (lengthCheck) return lengthCheck;

    if (pass != pass2) return {'success': 'Passwords don\'t match.'};

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

    await updateUser({user: user});

    return { success: 'Successfully created account.', location: '/'};
}

backend.login = async ({user, pass, cookies}) => {
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

backend.postCreate = async ({content, user}) => {
    if (!content) return {'success': 'No post provided.'}

    var lengthCheck = checkLength(content,'Post content',1,10240);

    if (lengthCheck)
        return lengthCheck;

    if (!content) return {'success': 'There is no post!' };

    var id = randomBytes(10).toString('hex');

    var postFlatten = formatPost(content).flat();
    var reply = postFlatten[postFlatten.findIndex(x => x.subtype == 'post')];

    if (reply)
        reply = reply.url.split('/').pop();

    await db.run('INSERT INTO post (username, id, content, rating, reply, time) VALUES (?, ?, ?, ?, ?, ?)', [
        user,
        id,
        content,
        calcVote(0,0),
        reply || '',
        Math.floor(new Date() * 1000)
    ])

    return {'success': 'Your post has been broadcasted!', 'href': `/post/${id}` };
}

backend.postDelete = async ({id, user}) => {

    await db.run('DELETE FROM post WHERE username = ? AND id = ?', [
        user,
        id
    ])

    return {'success': 'Your post has been deleted!', 'href': `/post/${id}` };
}

backend.userGet = async ({user}) => {
    var posts = await db.all('SELECT * from user WHERE username = ?', [
        user
    ])

    if (!posts || posts.length < 1) {
        return {'success': 'User does not exist.'}
    }

    var following = await db.all('SELECT * from follow WHERE username = ?', [
        user
    ]);

    var followers = await db.all('SELECT * from follow WHERE following = ?', [
        user
    ]);

    if (!following) following = [];

    if (!followers) followers = [];

    return {data: posts[0], following, followers};
}

backend.userBio = async ({user}) => {
    var posts = await db.all('SELECT * from bio WHERE username = ?', [
        user
    ])

    if (!posts || posts.length < 1) {
        return {'success': 'Bio does not exist.'}
    }

    return {data: posts[0]};
}

backend.postBulk = async ({page, id, user, cookies, sort, type}) => {
    var posts;

    var userAuth = (await backend.token({cookies})).data || '';

    sort = (LEGAL_SORTS.indexOf(sort + '') == -1) ? 'rating' : sort;

    if (type == 'all') {
        posts = await db.all('SELECT * from post ORDER BY '+sort+' DESC LIMIT ?, ?', [
            page*ROW_COUNT,
            ROW_COUNT
        ])
    } else if (type == 'post') {
        posts = await db.all('SELECT * from post WHERE id = ?', [
            id
        ]);

        if (posts.length == 0) posts.push({});

        posts.push(...(await db.all('SELECT * from post WHERE reply = ? ORDER BY '+sort+' DESC LIMIT ?, ?', [
            id,
            page*ROW_COUNT,
            ROW_COUNT
        ])))

    } else if (type == 'user') {
        posts = await db.all('SELECT * from post WHERE username = ? ORDER BY '+sort+' DESC LIMIT ?, ?', [
            user,
            page*ROW_COUNT,
            ROW_COUNT
        ])
    } else if (type == 'follow') {
        posts = await db.all('SELECT * from post WHERE username IN (SELECT username from follow WHERE username = ?) ORDER BY '+sort+' DESC LIMIT ?, ?', [
            userAuth,
            page*ROW_COUNT,
            ROW_COUNT
        ])

        console.log(posts);
    }

    posts = posts.map(post => {
        return {...post, isAuthor: userAuth == post.username};
    })

    return {data: posts};
}

backend.vote = async ({id, vote, user}) => {
    if (!id || (vote != 'down' && vote != 'up')) return {success: 'fail' };
    
    var isCreator = (await db.all('SELECT * from post WHERE id = ?', [
        id
    ]))[0].username == user;

    if (isCreator)
        return {success: 'fail' };

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

    var user = await db.all('SELECT * from post WHERE id = ?', [
        id
    ]) || [];

    if (!user[0])
        return {success: 'fail' };

    await updateUser({user: user[0].username});

    return {data: {up,down}};
}

backend.token = async ({cookies}) => {
    var tokenIn = cookies.get('token');

    var existingAccounts = await db.all('SELECT username from token WHERE token = ?',[
        tokenIn
    ]);
    
    if (!existingAccounts || existingAccounts.length < 1)
        return false;

    return {data: existingAccounts[0].username};
}

backend.follow = async ({target, user}) => {
    var isFollowing = await db.all('SELECT * FROM follow WHERE username = ? AND following = ?',[
        user,
        target
    ]);

    if (isFollowing && isFollowing.length > 0) {
        await db.run('DELETE FROM follow WHERE username = ? AND following = ?',[
            user,
            target
        ]);
    } else {
        await db.run('INSERT INTO follow (username, following) VALUES (?, ?)',[
            user,
            target
        ]);
    }

    var following = await db.all('SELECT * from follow WHERE username = ?', [
        target
    ]);

    var followers = await db.all('SELECT * from follow WHERE following = ?', [
        target
    ]);

    return {'success': 'User followed/unfollowed.', 'data': {following, followers}};
};

let fileCreate = (type) => {
    return async ({img, extension,id, last, user }) => {
        let validExtensions = VALID_EXTENSIONS;

        if (type == 'pfp') validExtensions = ['png'];

        if (ridArray[id] !== '' && !(ridArray[id])) {
            ridArray[id] = img;
        } else {
            ridArray[id] += img;
        }
    
        const imgData = ridArray[id];
    
        if (last != 'true') {
            return {'success': 'Image still proccessing...'}
        } else {
            ridArray[id] = false;
        }
    
        const imgHash = createHash('md5').update(imgData).digest('hex');
    
        if (!imgHash)
            return {'success': 'Image not provided.'}
    
        if (imgHash.length > FILE_SIZE_LIMIT)
            return {'success': 'Image too big.'}
    
        const extensionSafe = safePath(extension);
    
        if (validExtensions.indexOf(extensionSafe) == -1)
            return { success: 'Illegal file extension. Permitted file extensions are: ' + validExtensions.join(', ') };
    
        if (type == 'post') {
            writeFile(`${process.cwd()}/db/post-${imgHash}.${extensionSafe}`,imgData,{encoding: 'base64'});
        } else {
            writeFile(`${process.cwd()}/db/pfp-${user}.png`,imgData,{encoding: 'base64'});
        }
    
        return { success: 'Successfully uploaded file.', 'href': `/img/${imgHash}.${extensionSafe}`};
    }    
} 
backend.fileCreate = fileCreate('post');
backend.pfp = fileCreate('pfp');


export {
    backendProxy,
    backend,
    VALID_EXTENSIONS
}