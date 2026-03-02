function Post({ onClick, postdata: { username, content, likes, isVerified } }) {
    return (
      <div>
        <p>{`${username} - ${content}`}</p>
        <p>{`Likes: ${likes}`}</p>
        <p>{`Verified: ${isVerified ? 'Yes' : 'No'}`}</p>
        <button type="button" onClick={onClick}>Click Me!</button>
      </div>
    );
  }

export default Post;