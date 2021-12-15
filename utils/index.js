import settings from '../settings';

export const getUserDisplayName = (memberId, members) =>
  settings.private === false || settings.publicUsers.includes(Number(memberId))
    ? members[memberId].name
    : memberId;
