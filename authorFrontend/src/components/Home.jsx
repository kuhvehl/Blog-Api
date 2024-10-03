import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://kuhvehl-blog-api.adaptable.app/api/posts/all",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        console.error("Failed to fetch posts:", response.statusText);
      }
    };

    fetchPosts();
  }, []);

  const togglePublishedStatus = async (post) => {
    const token = localStorage.getItem("token");
    const updatedStatus = !post.published;

    const response = await fetch(
      `https://kuhvehl-blog-api.adaptable.app/api/posts/${post.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: post.title,
          content: post.content,
          published: updatedStatus,
        }),
      }
    );

    if (response.ok) {
      const updatedPost = await response.json();
      setPosts((prevPosts) =>
        prevPosts.map((p) => (p.id === updatedPost.id ? updatedPost : p))
      );
    } else {
      console.error("Failed to update post:", response.statusText);
    }
  };

  return (
    <div>
      <h1>Blog Posts</h1>
      <Link to="/create">
        <button>Create New Post</button>
      </Link>
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content.substring(0, 100)}...</p>
          <Link to={`/post/${post.id}`}>View Full Post</Link>{" "}
          <button onClick={() => togglePublishedStatus(post)}>
            {post.published ? "Unpublish" : "Publish"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Home;
