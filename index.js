// TODO: mini parser

function getDependencies(code, options) {
  if (!code) {
    return [];
  }

  const dependencySet = new Set();

  const Regexp1 = /(?:require|import|url)\(['"`]([^'"]+)['"`]\)/g;
  const Regexp2 = /(?:\@import|from|import)\s+['"]([^'"]+)['"]/g;
  const Regexp3 = /(?:url)\(([^'"]+)\)/g;
  const Regexp4 = /(?:[sS][rR][cC]=)['"]([^'"]+)['"]/g;

  for (const match of code.matchAll(Regexp1)) {
    dependencySet.add(match[1]);
  }

  for (const match of code.matchAll(Regexp2)) {
    dependencySet.add(match[1]);
  }

  if (options?.css) {
    for (const match of code.matchAll(Regexp3)) {
      dependencySet.add(match[1]);
    }
  }

  if (options?.html) {
    for (const match of code.matchAll(Regexp4)) {
      dependencySet.add(match[1].trim());
    }
  }

  return [...dependencySet];
}

module.exports = getDependencies;
