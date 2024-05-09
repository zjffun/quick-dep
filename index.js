// TODO: mini parser

function getDep(code) {
  if (!code) {
    return [];
  }

  const dependencySet = new Set();

  const Regexp1 = /(?:require|import|url)\(['"`]([^'"]+)['"`]\)/g;
  const Regexp2 = /(?:\@import|from|import)\s+['"]([^'"]+)['"]/g;
  const Regexp3 = /(?:url)\(([^'"]+)\)/g;

  for (const match of code.matchAll(Regexp1)) {
    dependencySet.add(match[1]);
  }

  for (const match of code.matchAll(Regexp2)) {
    dependencySet.add(match[1]);
  }

  for (const match of code.matchAll(Regexp3)) {
    dependencySet.add(match[1]);
  }

  return [...dependencySet];
}

module.exports = getDep;
