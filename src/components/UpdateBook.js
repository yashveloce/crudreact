import React,{useEffect, useState} from 'react';
import { useHistory, useParams } from "react-router-dom";
import {
    useQuery,
    gql,
    useMutation
  } from "@apollo/client";
const getBookQuery=gql`
query MyQuery($id:Int!){
  Book(where: {id: {_eq: $id}}) 
  {
    id
    name
    genre
    author_name
  }
}
`
const getAuthorQuery=gql`
{
  Author{
    id
    name
    age
  }
}
`

const putBookMutation=gql`
mutation MyMutation($id:Int!,$name:String!,$genre:String!){
  update_Book_by_pk(pk_columns: {id: $id}, _set: {name:$name, genre:$genre}) {
    author_name
    genre
    id
    name
  }
}
`

  const UpdateBook=() =>
  {
    const [books,setBooks]=useState({
      name:"",
      genre:""
    });
    let history = useHistory();
    const {id} = useParams();
    const [updateBook,{ loading1, error1, data1 }] = useMutation(putBookMutation);
    //console.log(Books.data.Book[0]);
    console.log(data1)
    const Books =  useQuery(getBookQuery,{variables:{id:id}})

    const Authors = useQuery(getAuthorQuery);
    if (Books.loading) return 'Loading...';
    if (Books.error) return `Error! ${Books.error.message}`;

    
    
    const onInputChange=(e)=>{
      console.log(e.target.value);
      //setBooks({...books,[e.target.name]:e.target.value})
      setBooks({ ...books,[e.target.name]: e.target.value });
      //console.log(books);
    }
    const onFormSubmit=e=>{
      e.preventDefault();
      console.log(e.target[0].value);
      updateBook({variables:{id:id,name:e.target[0].value,genre:e.target[1].value}});
      history.push("/list");
    }
      return(
        <div className="container">
           <h4 className="text-center mb-4">Edit Book</h4>
           <form onSubmit={e=>onFormSubmit(e)}>
           <label>Name</label>
            <input
              type="text"
              className="form-control form-control-lg"
              name="name"
              defaultValue={Books.data.Book[0].name}
              onChange={e=>onInputChange(e)}//e=>onInputChange(e)
            />
            <label>Genre</label>
            <input
              type="text"
              className="form-control form-control-lg"
              name="genre"
              defaultValue={Books.data.Book[0].genre}//Books.data.Book[0].genre
              onChange={e=>onInputChange(e)}
            />
            <button className="btn btn-secondary btn-block">Update Book</button>
           </form>
          
        </div>
      )
  }

  export default UpdateBook;