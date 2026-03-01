

import './App.css'
import Post from './components/test'

function App() {
  

  return (
    <>
      <p>Hello World</p>
      <Post postdata={{ username: 'John', content: 'Hello World', likes: 10, isVerified: true }} />
      <Post postdata={{ username: 'Jane', content: 'Hello World', likes: 10, isVerified: true }} />
      <Post postdata={{ username: 'Jim', content: 'Hello World', likes: 10, isVerified: true }} />
      <Post postdata={{ username: 'Jill', content: 'Hello World', likes: 10, isVerified: true }} />
      <Post postdata={{ username: 'Jack', content: 'Hello World', likes: 10, isVerified: true }} />
      <Post postdata={{ username: 'Jill', content: 'Hello World', likes: 10, isVerified: true }} />
    </>
  )
}

export default App
