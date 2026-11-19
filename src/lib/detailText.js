// The API's detail section has one text field (`paragraph`, max 5000 chars). Bullet points are stored
// inside it as trailing "- item" lines, so no backend change is needed:
//
//   Intro text (optional)
//
//   - First point
//   - Second point
//
// Anything that doesn't end in "- " lines is plain text and round-trips unchanged.

export const MAX_PARAGRAPH = 5000;

const BULLET = /^\s*-\s+(.*)$/;

export function parseDetailText(text = '') {
  const lines = String(text).split('\n');
  const items = [];
  let end = lines.length;
  while (end > 0 && BULLET.test(lines[end - 1])) {
    items.unshift(lines[end - 1].match(BULLET)[1]);
    end -= 1;
  }
  return { intro: lines.slice(0, end).join('\n').trim(), items };
}

export function serializeDetailText({ intro = '', items = [] }) {
  const points = items.map((i) => i.trim()).filter(Boolean).map((i) => `- ${i}`);
  return [intro.trim(), points.join('\n')].filter(Boolean).join('\n\n');
}
