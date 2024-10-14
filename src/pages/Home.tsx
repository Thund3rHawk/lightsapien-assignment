import axios from "axios";
import { useEffect, useState } from "react";
import ImageBook from "../components/ImageBook";

interface typeBooks {
  id: number;
  title: string;
  chapter_id: number[];
}

const Home = () => {
  const [books, setBooks] = useState<typeBooks[]>([]);
  const [bookContent, setBookContent] = useState<typeBooks>();
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchApi() {
    //   let data = [];
      try {
        const axiosInstance = axios.create({
            timeout: 10000 // 10 seconds
          });
        const resp = await axiosInstance.get("http://52.195.171.228:8080/books/");
        setBooks(resp.data);
        // data = resp.data;
        const respContent = await axiosInstance.get(
          `http://52.195.171.228:8080/books/${resp.data[0].id}/`
        );
        const chapter_id = respContent.data.chapter_ids;
        const id = respContent.data.id;
        const title = respContent.data.title;
        setBookContent({ id: id, title: title, chapter_id: chapter_id });
        const imagesResp = await axiosInstance.get (`http://52.195.171.228:8080/chapters/${resp.data[0].chapter_ids[0]}/`)
        setImages(imagesResp.data.pages);
      } catch (error) {
        console.log("Api fetching error: ", error);
      } finally {
       setIsLoading (false)
      }
    }
    fetchApi();    
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  async function clickBtn(bookId: number) {
    try {
      const resp = await axios.get(
        `http://52.195.171.228:8080/books/${bookId}/`
      );
      const chapter_id = resp.data.chapter_ids;
      const id = resp.data.id;
      const title = resp.data.title;
      setBookContent({ id: id, title: title, chapter_id: chapter_id });
    } catch (error) {
      console.log("book error: ", error);
    }
  }

  async function selectChapter(id: number) {
    try {
      const resp = await axios.get(
        `http://52.195.171.228:8080/chapters/${id}/`
      );
      console.log(resp.data);
      setImages(resp.data.pages);
      console.log(images);
    } catch (error) {
      console.log("book fetching error: ", error);
    }
  }

  return (
    <div className="max-w-2xl h-screen w-screen flex items-center flex-col bg-gray-100 pt-5">
      <div className="flex">
        {books &&
          books.map((book: typeBooks, index: number) => {
            return (
              <button
                key={index}
                onClick={() => {
                  clickBtn(book.id);
                }}
                className="border border-black w-36 py-2 rounded-md"
              >
                {book.title}
              </button>
            );
          })}
      </div>
      <div className="flex">
        {bookContent?.chapter_id &&
          bookContent?.chapter_id.map((chapter_id, index: number) => {
            return (
              <button
                key={index}
                onClick={() => {
                  selectChapter(chapter_id);
                }}
                className="border border-black py-1 w-10 rounded-md"
              >
                {chapter_id}
              </button>
            );
          })}
      </div>
      <ImageBook images={images} />
    </div>
  );
};

export default Home;
