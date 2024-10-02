// eslint-disable-next-line react/prop-types
const Header = ({ user }) => {
  console.log(user);
  return (
    <header>
      <h1>Bloggers Only</h1>
      {user ? (
        // eslint-disable-next-line react/prop-types
        <p>Welcome, {user.username}!</p>
      ) : (
        <p>Please log in or register.</p>
      )}
    </header>
  );
};

export default Header;
