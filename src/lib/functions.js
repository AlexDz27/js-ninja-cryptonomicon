export function stringsAreEqual(strA, strB) {
  return strA.toUpperCase() === strB.toUpperCase();
}

export function getMatchesCountOnStr(str, pattern) {
  // Find all occurrences, case-insensitive
  const regexp = new RegExp(pattern, 'ig');

  return str.match(regexp)?.length;
}