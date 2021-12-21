import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Line,
} from 'recharts';

import styles from '../styles/LocalScoreRankByDay.module.css';
import colours from '../utils/colours';
import getUserDisplayName from '../utils/getUserDisplayName';

const LocalScoreRankByDay = ({ members }) => {
  const getStarTimestamp = (member, day, part) =>
    member[1].completion_day_level[day]?.[part]?.get_star_ts;

  const getPartRanks = (members, day, part) =>
    Object.entries(members)
      .filter((member) => !!getStarTimestamp(member, day, part))
      .sort((memberA, memberB) => {
        const starTimestampA = getStarTimestamp(memberA, day, part) || Infinity;
        const starTimestampB = getStarTimestamp(memberB, day, part) || Infinity;
        return starTimestampA - starTimestampB;
      })
      .map(([memberId]) => memberId);

  const ranksByDays = [...Array(26).keys()]
    .slice(1)
    .map((day) => {
      const part1Ranks = getPartRanks(members, day, 1);
      const part2Ranks = getPartRanks(members, day, 2);
      return [part1Ranks, part2Ranks];
    })
    .filter(([part1, part2]) => part1.length && part2.length);

  const totalNumberOfMembers = Object.keys(members).length;

  const allMembersId = Object.entries(members)
    .filter((member) => member[1].local_score)
    .sort((a, b) => b[1].local_score - a[1].local_score)
    .map(([memberId]) => memberId);

  const numberOfMembersToShow = 21;
  const membersToShow = allMembersId.slice(0, numberOfMembersToShow);

  const cumulativeLocalScoresByDay = [];
  for (let i = 0; i < ranksByDays.length; i++) {
    const dailyMembersSorted = [];
    for (let memberId of membersToShow) {
      const rankPart1 = ranksByDays[i][0].indexOf(String(memberId));
      const scorePart1 = rankPart1 > -1 && totalNumberOfMembers - rankPart1;
      const rankPart2 = ranksByDays[i][1].indexOf(String(memberId));
      const scorePart2 = rankPart2 > -1 && totalNumberOfMembers - rankPart2;
      let previousDayScore = 0;
      if (i > 0) {
        previousDayScore += cumulativeLocalScoresByDay[i - 1].find(
          ([memberDisplayed]) =>
            memberDisplayed === getUserDisplayName(memberId, members)
        )[1];
      }
      dailyMembersSorted.push([
        getUserDisplayName(memberId, members),
        scorePart1 + scorePart2 + previousDayScore,
      ]);
    }
    cumulativeLocalScoresByDay.push(
      dailyMembersSorted.sort((a, b) => b[1] - a[1])
    );
  }

  const data = [];
  for (let i = 0; i < ranksByDays.length; i++) {
    const day = [['name', `D${i + 1}`]];
    for (let memberId of membersToShow) {
      const rankOnThatDay =
        cumulativeLocalScoresByDay[i].indexOf(
          cumulativeLocalScoresByDay[i].find(
            ([member]) => member === getUserDisplayName(memberId, members)
          )
        ) + 1;
      day.push([getUserDisplayName(memberId, members), rankOnThatDay]);
    }
    data.push(Object.fromEntries(day));
  }

  const podiumByDay = Object.fromEntries(
    ranksByDays.map(([, dayRankPart2], index) => {
      const key = `D${index + 1}`;
      const podium = dayRankPart2
        .slice(0, 3)
        .map((elem, index) => [getUserDisplayName(elem, members), index + 1]);
      return [key, Object.fromEntries(podium)];
    })
  );

  const CustomisedDot = (props) => {
    const { cx, cy, payload, dataKey } = props;
    const podiumColours = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' };
    const day = payload.name;
    const rank = podiumByDay[day]?.[dataKey];
    const width = 40;
    const height = 40;

    if ([1, 2, 3].includes(rank)) {
      return (
        <svg
          x={cx - width / 2}
          y={cy - height / 2}
          width={width}
          height={height}
          fill={podiumColours[rank]}
          viewBox="0 0 1024 1024"
        >
          <circle cx="50%" cy="50%" r="140" />
        </svg>
      );
    }

    return null;
  };

  const lines = membersToShow.map((memberId, index) => (
    <Line
      key={memberId}
      type="linear"
      dataKey={getUserDisplayName(memberId, members)}
      dot={<CustomisedDot />}
      stroke={colours[index]}
      isAnimationActive={false}
      strokeWidth={3}
    />
  ));

  return (
    <>
      <h1 className={styles.title}>
        Local score rank by day (top {numberOfMembersToShow})
      </h1>
      <ResponsiveContainer width="100%" minHeight={750}>
        <LineChart data={data} margin={{ top: 25, bottom: 25 }}>
          <CartesianGrid strokeDasharray="4" stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis domain={[1, 'dataMax']} reversed={true} />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            iconType="plainline"
            wrapperStyle={{
              paddingLeft: '25px',
            }}
          />
          {lines}
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default LocalScoreRankByDay;
