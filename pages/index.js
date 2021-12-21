import Head from 'next/head';
import styles from '../styles/Home.module.css';
import LocalScoreRankByDay from '../components/LocalScoreRankByDay';

export async function getServerSideProps() {
  const cookie = `session=${process.env.COOKIE}`;
  const endpoint = `https://adventofcode.com/2021/leaderboard/private/view/${process.env.OWNER_ID}.json`;
  const response = await fetch(endpoint, {
    headers: {
      Cookie: cookie,
    },
  });
  const data = await response.json();

  return { props: { data } };
}

export default function Home({ data }) {
  const { members } = data;
  return (
    <div className={styles.container}>
      <Head>
        <title>Advent of Code Analytics</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LocalScoreRankByDay members={members} />
    </div>
  );
}
