function parseCookies(cookieHeader) {
    var cookies = {};
  
    // Split the cookie string by ';'
    cookieHeader && cookieHeader.split(';').forEach(function(cookie) {
        var parts = cookie.split('=');
        var name = parts.shift().trim();
        var value = decodeURI(parts.join('='));
        cookies[name] = value;
    });
  
    return cookies;
  }

module.exports = parseCookies;