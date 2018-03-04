
// FS is a built in module to node that let's us read files from the system we're running on
const fs = require('fs');


// Dump is a handy debugging function we can use to sort of "console.log" our data
exports.dump = (obj) => JSON.stringify(obj, null, 2);

// Some details about the site
exports.siteName = `ESEFEN!`;

exports.adminNav = [
    { label: 'Users', key: 'users', href: '/admin/users' },
    { key: 'home', href: '/admin', icon: '/public/images/icons/home.svg'},
    { key: 'site', href: '/', icon: '/public/images/icons/globe.svg' },
    { key: 'logout', href: '/logout', icon: '/public/images/icons/key.svg' }
]; 