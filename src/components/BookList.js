import React from 'react';
import {
    useQuery,
    gql,
    useMutation,
    useSubscription
  } from "@apollo/client";
  import { Switch, Route, Link } from "react-router-dom";
  import { DataGrid } from '@material-ui/data-grid';
  import Header from './Header';
  import auth from '../auth';
//import {MDBDataTableV5} from 'mdb-react-ui-kit';

  // const getBookQuery=gql`
  //   query getquery{
  //       Book{
  //           id
  //           name
  //           genre
  //       }
  //   }
  // `
  const getBookQuery=gql`
  subscription MySubscription {
    Book {
      name
      id
      genre
    }
  }
  `
  const deleteBookMutation=gql`
  mutation MyMutation($id:Int!) {
    delete_Book_by_pk(id:$id) {
      id
      genre
      author_name
      name
    }
  }
  `
  
 
  
function BookList()
{
  const deleteBook=(id)=>{
    //console.log(id);
    deleteBookData({variables:{id:id}});
    }
    const [deleteBookData,{ loading1, error1, data1 }] = useMutation(deleteBookMutation);
    const { loading, error, data } = useSubscription(getBookQuery, {
      // refetchQueries: [
      //   getBookQuery, // DocumentNode object parsed with gql
      //   'getquery' // Query name
      // ],
    });
    console.log(data);
    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;
    
    const columns = [
      { field: 'id', headerName: 'ID', width: 150 },
      {
        field: 'name',
        headerName: 'Name',
        width: 150,
        editable: true,
      },
      {
        field: 'genre',
        headerName: 'Genre',
        width: 150,
        editable: true,
      },
      {
        field: 'action',
        headerName: 'Action',
        width: 500,
        renderCell: (params) => {
          return (
            <div className="btn-group">
            <Link to={`/update/${params.row.id}`} className="">
            <button type="button" className="btn btn-primary" >Edit</button>
            </Link>
            <Link>
            <button className="btn btn-danger" onClick={()=>deleteBook(params.row.id)}>Delete</button>
            </Link>
            </div>
          );
       }
      },
    ];
    
    const rows=data.Book;
    return(
      <>
      {console.log(auth.authenticated)}
      <Header />
        <div style={{ height: 800, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
    </>
    )
}

export default BookList;