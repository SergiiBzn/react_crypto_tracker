import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { fetchCrypto } from '../api/coinGecko';
import { CryptoCard } from '../components/CryptoCard';

export const Home = () => {
  const [cryptoList, setCryptoList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('market_cap_rank');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  const fetchCryptoData = async () => {
    try {
      const data = await fetchCrypto();
      setCryptoList(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching cryptocurrency data:', error);
      setError('Failed to load crypto data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    /*     const intervalData = setInterval(() => {
      fetchCryptoData();
    }, 30000); */

    fetchCryptoData();

    // return () => clearInterval(intervalData);
  }, []);

  useEffect(() => {
    filterAndSort();
  }, [sortBy, cryptoList, searchQuery]);

  const filterAndSort = () => {
    let filtered = cryptoList.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.current_price - b.current_price;
        case 'price_desc':
          return b.current_price - a.current_price;
        case 'change':
          return a.p;
        case 'market_cap':
          return a.market_cap - b.market_cap;
        case 'market_cap_rank':
        default:
          return a.market_cap_rank - b.market_cap_rank;
      }
    });

    setFilteredList(filtered);
  };

  return (
    <div className='app'>
      <header className='header'>
        <div className='header-content'>
          <div className='logo-section'>
            <Link to='/' className='logo-link'>
              <h1>Crypto Tracker</h1>
              <p>Track the latest cryptocurrency prices and market data.</p>
            </Link>
          </div>
          <div className='search-section'>
            <input
              type='text'
              placeholder='Search cryptocurrencies...'
              className='search-input'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>
      <div className='controls'>
        <div className='filter-group'>
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value='market_cap_rank'>Rank</option>
            <option value='name'>Name</option>
            <option value='price'>Price (Low to High)</option>
            <option value='price_desc'>Price (High to Low)</option>
            <option value='market_cap'>Market Cap</option>
          </select>
        </div>
        <div className='view-toggle'>
          <button
            className={viewMode === 'grid' ? 'active' : ''}
            onClick={() => setViewMode('grid')}
          >
            Grid
          </button>
          <button
            className={viewMode === 'list' ? 'active' : ''}
            onClick={() => setViewMode('list')}
          >
            List
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className='loading'>
          <div className='spinner'></div>
          <p>Loading crypto data...</p>
        </div>
      ) : error ? (
        <div className='no-results'>
          <p>{error}</p>
        </div>
      ) : (
        <div className={`crypto-container ${viewMode}`}>
          {filteredList.map((crypto, key) => (
            <CryptoCard key={key} crypto={crypto} />
          ))}
        </div>
      )}
    </div>
  );
};
