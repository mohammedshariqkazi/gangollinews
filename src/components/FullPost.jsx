// FullPost.jsx

import React, { useState, useEffect } from 'react';
import './FullPost.css'; // Make sure to import FullPost.css

const FullPost = ({ postId, onClose }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`https://gangolli.in/wp-json/wp/v2/posts/${postId}?_embed`);
        const data = await response.json();
        setPost(data);
        setLoading(false);
        // Add the post URL to the browser history
        window.history.pushState(null, null, `/post/${data.slug}`);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [postId]);

  return (
    <div className={`full-post ${loading ? 'loading' : ''}`}>
      {post ? (
        <>
          <span className="close-button" onClick={onClose}>&times;</span>
          <a href="/">
            <center><img
              src={'/assets/gangollinews.png'} // Update the path to your logo
              alt="Gangolli News logo"
              className="logo"
            /></center>
          </a>
          <hr></hr>
          <h2>{post.title.rendered}</h2>
          <img
            src={post._embedded['wp:featuredmedia'][0]?.media_details.sizes.medium.source_url || '/assets/placeholder.webp'}
            alt="Featured"
            className="featured-image"
          />
          <div className="post-content">
            <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
          </div>
          <button className="back-button" onClick={onClose}>Back</button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default FullPost;
