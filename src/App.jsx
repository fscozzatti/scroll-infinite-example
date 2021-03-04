import { useState, useRef, useCallback } from 'react'
import useBookSearch from './components/hooks/useBookSearch'
function App() {
  const [query, setQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(1)

  const {
    books,
    hasMore,
    loading,
    error
  } = useBookSearch(query, pageNumber)

  const observer = useRef()
  let lastBookElementRef = useCallback( node =>{
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver( entries => {
      if (entries[0].isIntersecting && hasMore){
        setPageNumber( prevPageNumber => prevPageNumber + 1)
      }
    })
    if (node) observer.current.observe(node)
  },[loading, hasMore])



  function handleSearch(e){
    setQuery(e.target.value)
    setPageNumber(1)
  }

  return (
  <>
    <ul class="list-group">
    <div className="contentFilter">
      <h1>Aplicación para buscar Titulos de Libros</h1>
      <nav>
        <input type="text" placeholder="Buscar libro por Título" value={query} onChange={handleSearch} className="inputLargo"></input>
      </nav>
    </div>
    {books.map((book, index) => {
      if (books.length === index + 1){
        return <li class="list-group-item" ref={lastBookElementRef} key={book}>{book}</li>
      }else{
        return <li class="list-group-item" key={book}>{book}</li>
      }

    })}
    <div>{loading && 'Loading...'}</div>
    <div>{error && 'Error'}</div>
    </ul>
  </>
  );
}

export default App;
