// eslint-disable-next-line react/prop-types
const Header = ({ user, onLogout }) => {
  return (
    <header>
      <h1>Readers Only</h1>
      {user ? (
        <>
          {/* eslint-disable-next-line react/prop-types */}
          <p>Welcome, {user.username}!</p>
          <button onClick={onLogout}>Logout</button>
        </>
      ) : (
        <p>Please log in or register.</p>
      )}
    </header>
  );
};

export default Header;
