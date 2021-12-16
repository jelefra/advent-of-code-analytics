import transliterate from '@sindresorhus/transliterate';

import settings from '../settings';

export const getUserDisplayName = (memberId, members) =>
  settings.private === false || settings.publicUsers.includes(Number(memberId))
    ? transliterate(members[memberId].name)
    : memberId;
