function loadPost(id) {
  return fetch(`https://jsonplaceholder.typicode.com/posts/${id}`).then((response) => response.json());
}

export default async function Page(props) {
  const post = await loadPost(props.params.id);
  console.log(props);
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </div>
  );
}
