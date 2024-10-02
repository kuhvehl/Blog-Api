// src/components/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(
        "https://kuhvehl-blog-api.adaptable.app/api/posts"
      );
      const data = await response.json();
      setPosts(data);
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h1>Blog Posts</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content.substring(0, 100)}...</p>{" "}
          {/* Display a snippet of the post */}
          <Link to={`/post/${post.id}`}>View Full Post</Link>{" "}
          {/* Link to PostDetails */}
        </div>
      ))}
    </div>
  );
};

export default Home;
