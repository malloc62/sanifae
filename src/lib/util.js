let checkLength = function(string, field, lowerBound, upperBound) {
    if (string.length < lowerBound) {
        if (string.length == 0) {
            return { success: `${field} cannot be blank.` }
        }
        return { success: `${field} is too short (minimum length: ${lowerBound} characters).` }
    }

    if (string.length > upperBound) {
        return { success: `${field} is too long (maximum length: ${upperBound} characters).` }
    }

    return false;
}

let checkRegex = function(string, field, regex) {
    if (string.search(regex) != -1) {
        return { success: `${field} contains illegal characters.` }
    }
    return false;
}

let calcVote = function(up,down, type) {
    var upPadded = up + 3;
    var downPadded = down + 3;
    var totalPadded = Math.max(up + down, 3);

    var rating =  -Math.log((1 / ((((upPadded - downPadded) / (upPadded + downPadded)) + 1) / 2)) - 1) / Math.log(Math.E);

    rating = Math.min(rating,10);

    if (type != 'user') {
        rating = Math.max(rating,-1);

        rating = (rating + 11) / 1.1;

        rating = rating * Math.log(totalPadded);
    } else {
        rating = Math.round(rating * Math.log(totalPadded) * 10);
    }

    return rating;
}

let handleSubmit = async e => {
    const ACTION_URL = e.target.action

    const formData = new FormData(e.target)
        
    return await fetch(ACTION_URL, {
        method: 'POST',
        body: formData
    }).then(x => x.text());
}

let safeName = function (text) {
    return text.replaceAll(/[^A-Za-z0-9\-\_]/g, '');
}

let formatPost = function(post) {
    post = post.split('\n');

    post = post.map(subPost => {
        return subPost.split(' ');
    });

    post = post.map(line => {
        line = line.map(subPost => {
            var splitPost = subPost.split('||');
            

            if (splitPost.length > 1) {
                var cap1 = splitPost[0];
    
                if (cap1 == 'img') {
                    var matchCleaned = safePath(splitPost[1]);
                    splitPost = {'type': 'img', 'url': `/img/${matchCleaned}`};
    
                    return splitPost;
                }
            } else if (subPost[0] == '@' || subPost[0] == '#') {
                var subPostIn = safeName(subPost.substring(0));

                var type = (subPost[0] == '@') ? 'user' : 'post';

                splitPost = {'type': 'link', 'display': subPost, 'subtype': type, 'url': `/${type}/${subPostIn}`};

                return splitPost;
            }

            return subPost;
        })
        return line;
    });

    return post;
}

let block = function(bool) {
    return (bool) ? 'block' : 'inline';
}

let safePath = function(path) {
    if (path == '..' || path == '.') return '';
    return path.replace(/[\/]+/g, '')
}

let setLocation = function(location, key, value) {
    var loc = new URL(location).searchParams;

    loc.set(key,value);
    return loc.toString();
}

export {
    checkLength,
    checkRegex,
    calcVote,
    handleSubmit,
    formatPost,
    block,
    safePath,
    setLocation
};