// src/components/PostDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const PostDetails = ({ user }) => {
  const { id } = useParams(); // Get post ID from URL
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Fetch post details and comments
  useEffect(() => {
    const fetchPostDetails = async () => {
      const response = await fetch(
        `https://kuhvehl-blog-api.adaptable.app/api/posts/${id}`
      );
      const data = await response.json();
      setPost(data);

      const commentsResponse = await fetch(
        `https://kuhvehl-blog-api.adaptable.app/api/comments/post/${id}`
      );
      const commentsData = await commentsResponse.json();
      setComments(commentsData);
    };

    fetchPostDetails();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment) return; // Prevent empty comments
    console.log(newComment);

    const token = localStorage.getItem("token");
    console.log("Token being sent:", token); // Log the token

    const response = await fetch(
      `https://kuhvehl-blog-api.adaptable.app/api/comments/post/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content: newComment }),
      }
    );

    if (response.ok) {
      const addedComment = await response.json();
      setComments((prev) => [...prev, addedComment]);
      setNewComment("");
    } else {
      const errorData = await response.json();
      console.error("Error adding comment:", errorData);
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <h2>Comments:</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>{comment.content}</li>
        ))}
      </ul>

      {user ? (
        <form onSubmit={handleAddComment}>
          <textarea
            placeholder="Add a comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          />
          <button type="submit">Submit Comment</button>
        </form>
      ) : (
        <p>Please log in to add a comment.</p>
      )}
    </div>
  );
};

export default PostDetails;
