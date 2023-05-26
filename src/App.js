import "./App.css";
import { useEffect, useState } from "react";
import { getAll, update } from "./BooksAPI";
import { Link } from "react-router-dom";

function App() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const func = async () => {
      setData(await getAll());
    };
    func();
  }, []);
  const handleselect = (e, id) => {
    const obj = data.filter((p) => {
      return p.id === id;
    });
    obj[0].shelf = e.target.value;

    const temp = data.filter((p) => {
      return p.id !== id;
    });

    setData([...temp, obj[0]]);

    update(id, e.target.value);
  };
  const BookShelf = ({ title }) => {
    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">{title}</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
            {data
              .filter((p) => {
                return p.shelf === title;
              })
              .map((s) => {
                return (
                  <li key={s.id}>
                    <div className="book">
                      <div className="book-top">
                        <div
                          className="book-cover"
                          style={{
                            width: 128,
                            height: 188,
                            backgroundImage: `url("${s.imageLinks.smallThumbnail}")`,
                          }}
                        ></div>
                        <div className="book-shelf-changer">
                          <select
                            defaultChecked={s.shelf}
                            onChange={(e) => handleselect(e, s.id)}
                          >
                            <option value="Move to..." disabled>
                              Move to...
                            </option>
                            <option value="currentlyReading">
                              Currently Reading
                            </option>
                            <option value="wantToRead">Want to Read</option>
                            <option value="read">Read</option>
                            <option value="none">None</option>
                          </select>
                        </div>
                      </div>
                      <div className="book-title">{s.title}</div>
                      <div className="book-authors">
                        {s.authors.map((author) => {
                          return <div key={author}>.{author}</div>;
                        })}
                      </div>
                    </div>
                  </li>
                );
              })}
          </ol>
        </div>
      </div>
    );
  };
  const CurrentShelf = () => {
    return <BookShelf title={"currentlyReading"} />;
  };
  const WantToReadShelf = () => {
    return <BookShelf title={"wantToRead"} />;
  };
  const ReadShelf = () => {
    return <BookShelf title={"read"} />;
  };

  return (
    <div className="app">
      {data && (
        <>
          {
            <div className="list-books">
              <div className="list-books-title">
                <h1>MyReads</h1>
              </div>
              <div className="list-books-content">
                <div>
                  <CurrentShelf />
                  <WantToReadShelf />
                  <ReadShelf />
                </div>
              </div>
              <div className="open-search">
                <Link to={"search"} state={{ data: data }}>
                  Add a book
                </Link>
              </div>
            </div>
          }
        </>
      )}
    </div>
  );
}

export default App;
