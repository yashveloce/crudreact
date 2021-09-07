import React,{useState} from 'react';
import {
    useQuery,
    gql,
    useMutation
  } from "@apollo/client";
  import { useHistory } from "react-router-dom";
 

  const getAuthorQuery=gql`
    {
        Author{
            id
            name
            age
        }
    }
  `
  const postBookMutation=gql`
  mutation addTodo($name:String!,$author_name:Int!,$genre:String!){
    insert_Book(objects: {author_name: $author_name, genre: $genre, name: $name}) {
      affected_rows
      returning{
        id
        name
        genre
        author_name
      }
    }
  }
  `
 

  const InsertBook=() =>
  {
    let history = useHistory();
      const [books,setBooks] = useState({
          name:"",
          genre:"",
          author_name:""
      })
      const savebook= e =>{
        e.preventDefault();
        addBook({variables:{name:books.name,genre:books.genre,author_name:parseInt(books.author_name)}});
        console.log(books.name)  
        history.push("/list");
      }
      const onInputChange= e =>{
         // console.log(e.target.value);
          setBooks({ ...books,[e.target.name]: e.target.value });
      }
      const { loading, error, data } = useQuery(getAuthorQuery);
      const [addBook,{ loading1, error1, data1 }] = useMutation(postBookMutation);
      console.log(data);
      if (loading) return 'Loading...';
      if (error) return `Error! ${error.message}`;
      return(
          <div>
                <form
                onSubmit={e => savebook(e)}
                  >
                    <div className="field">
                        <label>Book Name</label>
                        <input name="name" onChange={e=>onInputChange(e)} type="text" />
                    </div>
                    <div className="field">
                        <label>Genre</label>
                        <input name="genre" onChange={e=>onInputChange(e)} type="text" />
                    </div>
                    <div className="field">
                        <label>Book Author</label>
                        <select name="author_name" onChange={e => onInputChange(e)}>
                            <option>Select Author</option>
                        {data.Author.map(author=>(
                           <option key={author.id} value={author.id}>{author.name}</option>
                        ))}
                        </select> 
                    </div>
                    <button>Save</button>
                </form>
          </div>
      )
  }

  export default InsertBook;