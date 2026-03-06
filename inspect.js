var data = require('./data/openmrs-core.json');
var result = {};
data.vulnerabilities.forEach(function(v) {
  var pkg = 'unknown';
  var ver = 'unknown';
  if (v.location && v.location.dependency) {
    if (v.location.dependency.package) pkg = v.location.dependency.package.name;
    ver = v.location.dependency.version || 'unknown';
  }
  var key = pkg + '@' + ver;
  if (result[key] === undefined) result[key] = [];
  result[key].push(v.id + ' ' + v.severity);
});
Object.keys(result).forEach(function(k) {
  console.log(k + ' (' + result[k].length + ' vulns)');
  result[k].forEach(function(v) { console.log('  ' + v); });
});
