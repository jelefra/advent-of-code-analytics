import transliterate from '@sindresorhus/transliterate';

import settings from '../settings';

const getUserDisplayName = (memberId, members) => settings.private === false || settings.publicUsers.includes(Number(memberId))
  ? transliterate(members[memberId].name || `(anonymous user #${memberId})`)
  : memberId
;

export default getUserDisplayName;
