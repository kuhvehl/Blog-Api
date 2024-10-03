// eslint-disable-next-line react/prop-types
const Header = ({ user, onLogout }) => {
  return (
    <header>
      <h1>Bloggers Only</h1>
      {user && user.isAuthor ? (
        <>
          {/* eslint-disable-next-line react/prop-types */}
          <p>Welcome, {user.username}!</p>
          <button onClick={onLogout}>Logout</button>
        </>
      ) : (
        <p>Please log in</p>
      )}
    </header>
  );
};

export default Header;
