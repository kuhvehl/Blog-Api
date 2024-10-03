import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

const CreatePost = () => {
  const { id } = useParams(); // Get post ID from URL (if it's for editing)
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch post data if we are editing (id exists)
    if (id) {
      const fetchPostData = async () => {
        const response = await fetch(
          `https://kuhvehl-blog-api.adaptable.app/api/posts/${id}`
        );
        const data = await response.json();
        setTitle(data.title);
        setContent(data.content);
      };

      fetchPostData();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const url = id
      ? `https://kuhvehl-blog-api.adaptable.app/api/posts/${id}`
      : "https://kuhvehl-blog-api.adaptable.app/api/posts";

    const method = id ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });

    if (response.ok) {
      navigate("/");
    } else {
      console.error("Failed to submit post:", response.statusText);
    }
  };

  return (
    <div>
      <h1>{id ? "Edit Post" : "Create New Post"}</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit">{id ? "Update Post" : "Create Post"}</button>
      </form>
      <Link to={id ? `/post/${id}` : "/"}>← Cancel</Link>{" "}
    </div>
  );
};

export default CreatePost;
