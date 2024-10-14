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
  const [activeChapter, setActiveChapter] = useState(1);
  const [activeBook, setActiveBook] = useState(1);
  const [bookId, setBookId] = useState(1);

  useEffect(() => {
    async function fetchApi() {
      try {
        const axiosInstance = axios.create({
          timeout: 10000,
        });
        const resp = await axiosInstance.get(
          "http://52.195.171.228:8080/books/"
        );
        setBooks(resp.data);
        const respContent = await axiosInstance.get(
          `http://52.195.171.228:8080/books/${bookId}/`
        );
        const chapter_id = respContent.data.chapter_ids;
        const id = respContent.data.id;
        const title = respContent.data.title;
        setBookContent({ id: id, title: title, chapter_id: chapter_id });
        const imagesResp = await axiosInstance.get(
          `http://52.195.171.228:8080/chapters/${resp.data[bookId-1].chapter_ids[0]}/`
        );
        setImages(imagesResp.data.pages);
      } catch (error) {
        console.log("Api fetching error: ", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchApi();
  }, [bookId]);

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
      setBookId(bookId);
      console.log(bookId);      
      setActiveChapter(chapter_id[0]);
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
    <div className="max-w-2xl h-screen w-screen flex items-center flex-col bg-white pt-5">
      <div className="flex">
        {books &&
          books.map((book: typeBooks, index: number) => {
            return (
              <button
                key={index}
                onClick={() => {
                  clickBtn(book.id);
                  setActiveBook(book.id);
                }}
                className={`border border-black w-36 py-1 rounded-sm ${
                  activeBook === book.id ? "bg-green-900 text-white border-r-2 border-b-2" : " bg-gray-300"
                }`}
              >
                {book.title}
              </button>
            );
          })}
      </div>
      <div className="flex mt-3">
        {bookContent?.chapter_id &&
          bookContent?.chapter_id.map((chapter_id, index: number) => {
            return (
              <button
                key={index}
                onClick={() => {
                  selectChapter(chapter_id);
                  setActiveChapter(chapter_id);
                }}
                className={`border border-black py-1 w-10 ounded-sm ${
                  activeChapter === chapter_id ? "bg-green-900 text-white border-r-2 border-b-2" : "bg-gray-300"
                }`}
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
