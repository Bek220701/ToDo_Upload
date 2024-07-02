import axios from "axios";
import scss from "./TodoList.module.scss";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface TodoType {
 _id?: number;
 title: string;
 img: string;
 isCompleted: boolean;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const UPLOAD_URL = import.meta.env.VITE_BACKEND_UPLOAD_URL;

const TodoList = () => {
 const [todos, setTodos] = useState<TodoType[]>([]);
 const { register, handleSubmit } = useForm<TodoType>();

 const onSubmit: SubmitHandler<TodoType> = async (data) => {
  const file = data.img[0];
  const formData = new FormData();
  formData.append("avatar", file);

  const { data: responseImage } = await axios.post(UPLOAD_URL, formData, {
   headers: {
    "Content-Type": "multipart/form-data",
   },
  });

  const newData = {
   title: data.title,
   img: responseImage.url,
   isCompleted: false,
  };

  const { data: responseTodos } = await axios.post(BACKEND_URL, newData);
  setTodos(responseTodos);
 };

 const handleComplete = async (_id: number, isCompleted: boolean) => {
  const updateData = {
   isCompleted: !isCompleted,
  };

  const { data } = await axios.patch(`${BACKEND_URL}/${_id}`, updateData);
  setTodos(data);
 };

 const fetchTodos = async () => {
  const { data } = await axios.get(BACKEND_URL);
  setTodos(data);
 };

 useEffect(() => {
  fetchTodos();
 }, []);

 return (
  <div className={scss.TodoList}>
   <h1>TodoList</h1>
   <form onSubmit={handleSubmit(onSubmit)}>
    <input type="text" {...register("title", { required: true })} />
    <input type="file" {...register("img", { required: true })} />
    <button type="submit">Add</button>
   </form>
   <div className={scss.content}>
    {todos.map((item) => (
     <div
      key={item._id!}
      className={
       item.isCompleted
        ? `${scss.todo} ${scss.completed}`
        : `${scss.todo}`
      }>
      <h1>{item.title}</h1>
      <img src={item.img} alt={item.title} />
      <button onClick={() => handleComplete(item._id!, item.isCompleted)}>
       {
        item.isCompleted ? "Не завершено" : "Завершить"
       } 
      </button>
     </div>
    ))}
   </div>
  </div>
 );
};

export default TodoList;
