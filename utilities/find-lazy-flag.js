module.exports = findLazyFlag = title => {

  let titleText = title.trim();

  const isLazy = titleText.match(/^(%lazy%)/i) ? true : false;

  if(isLazy) {
    const titleIndex = title.lastIndexOf("%") + 1;
    titleText = title.slice(titleIndex).trim();
  }

  return {
    isLazy,
    titleText
  }
}