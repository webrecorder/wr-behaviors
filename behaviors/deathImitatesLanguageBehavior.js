import * as lib from '../lib';

let behaviorStyle;
if (debug) {
  behaviorStyle = lib.addBehaviorStyle(
    '.wr-debug-visited {border: 6px solid #3232F1;} .wr-debug-visited-thread-reply {border: 6px solid green;} .wr-debug-visited-overlay {border: 6px solid pink;} .wr-debug-click {border: 6px solid red;}'
  );
}

const moreInfoButtonSelector = 'button.btn.btn-more-info';

export default async function* deathImitatesLanguageBehavior(cliAPI) {
  const rootContainer = document.body.firstElementChild;
  let child = rootContainer.firstElementChild;
  const  state = {
    items: 0
  };
  while (child) {
    if (debug) lib.addClass(child, behaviorStyle.wrDebugVisited);
    await lib.scrollIntoViewWithDelay(child);
    lib.collectOutlinksFrom(child);
    await lib.selectElemFromAndClickWithDelay(child, moreInfoButtonSelector);
    state.items += 1;
    yield lib.stateWithMsgNoWait(`Viewed item`, state);
    child = lib.getElemSibling(child);
  }
  return lib.stateWithMsgNoWait('Behavior done', state);
}

export const metadata = {
  name: 'deathImitatesLanguageBehavior',
  match: {
    regex: /^(?:https?:\/\/(?:www\.)?)?deathimitateslanguage\.harmvandendorpel\.com\/?$/,
  },
  description:
    'Scrolls the page clicking all the images rendered at the current scroll level',
  updated: '2019-06-06T12:55:43',
};

export const isBehavior = true;
