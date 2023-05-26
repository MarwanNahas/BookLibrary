import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { update, search } from "./BooksAPI";
import debounce from "lodash/debounce";
const Search = () => {
  const location = useLocation();
  const [data, setData] = useState([]);
  const [searchedData, setSearchedData] = useState([]);
  useEffect(() => {
    setData(location.state.data);
  }, []);

  const handleSearch2 = (e) => {
    const func = async () => {
      if (e.target.value) {
        const temp = await search(e.target.value);

        if (temp && !temp.items && data) {
          const temp2 = temp.map((p) => {
            if (
              data.some((l) => {
                if (l.id === p.id) {
                  p.shelf = l.shelf;

                  return true;
                } else {
                  return false;
                }
              })
            ) {
              return p;
            } else {
              return { ...p, shelf: "none" };
            }
          });

          setSearchedData(
            temp2.filter((t) => {
              return (
                "imageLinks" in t &&
                t.imageLinks.smallThumbnail !== null &&
                "authors" in t &&
                t.authors !== null
              );
            })
          );
        } else {
          setSearchedData([]);
        }
      } else {
        setSearchedData([]);
      }
    };
    func();
  };

  const handleselect2 = (e, id) => {
    const obj = searchedData.filter((p) => {
      return p.id === id;
    });

    obj[0].shelf = e.target.value;

    const temp = searchedData.filter((p) => {
      return p.id !== id;
    });

    setSearchedData([...temp, obj[0]]);
    update(id, e.target.value);
  };
  const debounceFunc = useMemo(() => debounce(handleSearch2, 230));
  return (
    <>
      <div className="search-books">
        <div className="search-books-bar">
          <Link to={"/"} className="close-search">
            Close
          </Link>

          <div className="search-books-input-wrapper">
            <input
              type="text"
              placeholder="Search by title, author, or ISBN"
              onChange={(e) => debounceFunc(e)}
            />
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {searchedData &&
              searchedData.map((s) => {
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
                            defaultValue={s.shelf}
                            onChange={(e) => handleselect2(e, s.id)}
                          >
                            <option value="Move to.." disabled>
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
    </>
  );
};

export default Search;
