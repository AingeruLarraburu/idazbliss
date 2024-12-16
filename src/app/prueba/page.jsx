import Link from "next/link";

async function loadPosts() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await response.json();
  //await new Promise((resolve) => setTimeout(resolve, 3000));
  return data;
}

export default async function PruebaPage() {
  const posts = await loadPosts();
  return (
    <div>
      <p>Prueba Page</p>
      {posts.map((post) => (
        <div key={post.id}>
          <Link href={`/prueba/${post.id}`}>
            <h1>{post.title}</h1>
            <button>click</button>
            <hr></hr>
          </Link>
        </div>
      ))}
    </div>
  );
}
