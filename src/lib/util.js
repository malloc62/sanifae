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

let calcVote = function(up,down) {
    var upPadded = up + 3;
    var downPadded = down + 3;
    var totalPadded = Math.max(up + down, 3);

    var rating =  -Math.log((1 / ((((upPadded - downPadded) / (upPadded + downPadded)) + 1) / 2)) - 1) / Math.log(Math.E);

    rating = Math.min(rating,10);
    rating = Math.max(rating,-1);

    rating = (rating + 11) / 1.1;

    return rating * Math.log(totalPadded);
}

let calcVoteUser = function(up,down) {
    var upPadded = up + 3;
    var downPadded = down + 3;
    var totalPadded = Math.max(up + down, 3);

    var rating =  -Math.log((1 / ((((upPadded - downPadded) / (upPadded + downPadded)) + 1) / 2)) - 1) / Math.log(Math.E);

    rating = Math.min(rating,10);
    rating = Math.max(rating,-10);

    return Math.round(rating * Math.log(totalPadded) * 10);
}

let handleSubmit = async e => {
    const ACTION_URL = e.target.action

    const formData = new FormData(e.target)
        
    return await fetch(ACTION_URL, {
        method: 'POST',
        body: formData
    }).then(x => x.text());
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
                    var matchCleaned = splitPost[1].replace(/(\s+)/g, '\\$1');
                    splitPost = {'type': 'img', 'url': `/img/${matchCleaned}`};
    
                    return splitPost;
                }
            } else if (subPost[0] == '@') {
                var subPostIn = subPost.substring(0).replaceAll(/[^A-Za-z0-9\-\_]/g, '');

                splitPost = {'type': 'link', 'display': subPost, 'url': `/user/${subPostIn}`};

                return splitPost;

            } else if (subPost[0] == '#') {
                var subPostIn = subPost.substring(0).replaceAll(/[^A-Za-z0-9]/g, '');

                splitPost = {'type': 'link', 'display': subPost, 'url': `/post/${subPostIn}`};

                return splitPost;
            }

            return subPost;
        })
        return line;
    });

    return post;
}

function block(bool) {
    return (bool) ? 'block' : 'inline';
}

export {
    checkLength,
    checkRegex,
    calcVote,
    handleSubmit,
    calcVoteUser,
    formatPost,
    block
};