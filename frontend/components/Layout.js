import { useContext } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import Header from './Header';
import { AuthContext } from '../context/AuthContext';

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;

const Layout = ({ title, description, children }) => {
  const { user, loading } = useContext(AuthContext);

  return (
    <>
      <Head>
        <title>{title || 'Emotional Tracker'}</title>
        <meta name="description" content={description || 'Track your emotional wellbeing'} />
        <link rel="icon" href="/favicon.ico" />
        {/* No CSP headers */}
      </Head>

      <Header />

      <Main>
        {/* No loading indicator */}
        {loading ? (<p>Cargando...</p>) : children}
      </Main>
    </>
  );
};

export default Layout;