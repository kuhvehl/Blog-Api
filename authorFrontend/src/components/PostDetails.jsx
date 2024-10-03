import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const PostDetails = ({ user }) => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");

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

    if (!newComment) return;

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

  const handleDeleteComment = async (commentId) => {
    const response = await fetch(
      `https://kuhvehl-blog-api.adaptable.app/api/comments/${commentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.ok) {
      setComments(comments.filter((comment) => comment.id !== commentId));
    } else {
      const errorData = await response.json();
      console.error("Error deleting comment:", errorData);
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentContent(comment.content);
  };

  const handleUpdateComment = async (e) => {
    e.preventDefault();
    if (!editCommentContent) return;

    const response = await fetch(
      `https://kuhvehl-blog-api.adaptable.app/api/comments/${editingCommentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content: editCommentContent }),
      }
    );

    if (response.ok) {
      const updatedComment = await response.json();
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === updatedComment.id ? updatedComment : comment
        )
      );
      setEditingCommentId(null);
    } else {
      const errorData = await response.json();
      console.error("Error updating comment:", errorData);
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <Link to="/">← Back to Home</Link>

      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <p>Posted by: {post.author.username}</p>
      <p>Created at: {new Date(post.createdAt).toLocaleDateString()}</p>
      <h2>Comments:</h2>
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
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            {editingCommentId === comment.id ? (
              // Show the edit form if the comment is being edited
              <form onSubmit={handleUpdateComment}>
                <textarea
                  value={editCommentContent}
                  onChange={(e) => setEditCommentContent(e.target.value)}
                  required
                />
                <button type="submit">Update Comment</button>
                <button onClick={() => setEditingCommentId(null)}>
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <p>{comment.content}</p>
                <p>Commented by: {comment.user.username}</p>
                <p>
                  Created at: {new Date(comment.createdAt).toLocaleDateString()}
                </p>
                {user && user.id === comment.userId && (
                  <>
                    <button onClick={() => handleEditComment(comment)}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteComment(comment.id)}>
                      Delete
                    </button>
                  </>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostDetails;
