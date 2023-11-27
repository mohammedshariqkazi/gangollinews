// App.jsx

import React, { useState, useEffect } from 'react';
import gangolliNewsLogo from './assets/gangollinews.png';
import placeholderImage from './assets/placeholder.webp';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import FullPost from './components/FullPost'; // Import the FullPost component

function App() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://gangolli.in/wp-json/wp/v2/posts?per_page=9&page=${currentPage}&_embed`);
        const data = await response.json();
        setPosts([...posts, ...data]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const openFullPost = (postId) => {
    setSelectedPostId(postId);
  };

  const closeFullPost = () => {
    setSelectedPostId(null);
  };

  const loadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <div className="app-container">
      <header>
        <div className="text-center">
          <a href="/">
            <img src={gangolliNewsLogo} className="logo" alt="Gangolli News logo" />
          </a>
        </div>
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
      <p className="read-the-docs">
        Click on the Gangolli News logo to learn more
      </p>

      {/* Display FullPost component when selectedPostId is not null */}
      {selectedPostId !== null && (
        <FullPost postId={selectedPostId} onClose={closeFullPost} />
      )}
    </div>
  );
}

export default App;
