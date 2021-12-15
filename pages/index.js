import Head from 'next/head';
import styles from '../styles/Home.module.css';

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
  return (
    <div className={styles.container}>
      <Head>
        <title>Advent of Code Analytics</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ul>
        {Object.entries(data.members).map(([userId]) => (
          <li key={userId}>{userId}</li>
        ))}
      </ul>
    </div>
  );
}
