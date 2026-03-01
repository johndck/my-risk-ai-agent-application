function Post({ postdata: { username, content, likes, isVerified } }) {
    return (
      <div>
        <p>{`${username} - ${content}`}</p>
        <p>{`Likes: ${likes}`}</p>
        <p>{`Verified: ${isVerified ? 'Yes' : 'No'}`}</p>
      </div>
    );
  }

export default Post;