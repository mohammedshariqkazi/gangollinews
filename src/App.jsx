// App.jsx

import React, { useState, useEffect } from 'react';
import gangolliNewsLogo from '/assets/gangollinews.png';
import placeholderImage from '/assets/placeholder.webp';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import FullPost from './components/FullPost'; // Import the FullPost component

function App() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // Add state for menu

  useEffect(() => {
    fetch('https://gangolli.in/wp-json/wp/v2/categories?per_page=100')  // Adjust per_page as needed
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = selectedCategory
          ? `https://gangolli.in/wp-json/wp/v2/posts?categories=${selectedCategory.id}&per_page=9&page=${currentPage}&_embed`
          : `https://gangolli.in/wp-json/wp/v2/posts?per_page=9&page=${currentPage}&_embed`;

        const response = await fetch(url);
        const data = await response.json();
        setPosts([...posts, ...data]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, selectedCategory]);

  const openFullPost = (postId) => {
    setSelectedPostId(postId);
  };

  const closeFullPost = () => {
    setSelectedPostId(null);
  };

  const loadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleMenuClick = (category) => {
    setSelectedCategory(category);
    setPosts([]); // Clear existing posts
    setCurrentPage(1); // Reset page to 1 to fetch new posts
    setMenuOpen(false); // Close the menu when a menu item is clicked
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="app-container">
      <header>
        <div className="text-center">
          <a href="/">
            <img src={gangolliNewsLogo} className="logo" alt="Gangolli News logo" />
          </a>
        </div>
        <div className={`menu-icon ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
  {menuOpen ? (
    <span class="close"></span>
  ) : (
    <>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
    </>
  )}
</div>
        <nav className={`menu ${menuOpen ? 'open' : ''}`}>
          <ul>
            <li onClick={() => handleMenuClick(null)}>Home</li>
            {categories.map((category) => (
              <li key={category.id} onClick={() => handleMenuClick(category)}>
                {category.name}
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <hr></hr>
      <section className="news-section">
        <div className="row">
          {posts.map((post, index) => (
            <div key={post.id} className="col-md-4 mb-3" style={{ animation: `fadeIn 0.5s ease-in-out ${index * 0.2}s both` }}>
              <div className="card" style={{ cursor: 'pointer' }} onClick={() => openFullPost(post.id)}>
                <img
                  src={post._embedded['wp:featuredmedia'] ? post._embedded['wp:featuredmedia']['0'].source_url : placeholderImage}
                  alt="News Thumbnail"
                  className="card-img-top"
                />
                <div className="card-body">
                  <h5 className="card-title">{post.title.rendered}</h5>
                  <p className="card-text" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
                </div>
              </div>
            </div>
          ))}
        </div>
        {loading && (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        )}
        {!loading && (
          <div className="text-center mt-3">
            <button className="btn btn-primary" onClick={loadMore}>
              Load More
            </button>
          </div>
        )}
      </section>
      <center><p className="read-the-docs">
        Click Load More for more news
      </p></center>

      {/* Display FullPost component when selectedPostId is not null */}
      {selectedPostId !== null && (
        <FullPost postId={selectedPostId} onClose={closeFullPost} />
      )}
    </div>
  );
}

export default App;
