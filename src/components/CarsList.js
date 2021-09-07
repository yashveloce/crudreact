import React,{useState} from 'react';
import {
    useQuery,
    gql,
    useMutation,
    useSubscription,
    useLazyQuery
  } from "@apollo/client";
  import { Switch, Route, Link } from "react-router-dom";
  import { DataGrid } from '@material-ui/data-grid';
  import Header from './Header';
  import auth from '../auth';
  
  const READ_VEHICLE=gql`
  subscription MySubscription {
    Vehicles {
      model
      id
      brand
    }
  }
  `
  const READ_SINGLE_VEHICLE=gql`
  query MyQuery {
    Vehicles_by_pk(id: 300) {
      model
      id
      brand
    }
  }
  `
 
  const DELETE_VEHICLE=gql`
  mutation delete_mutation($id:Int!){
    delete_Vehicles_by_pk(id:$id)
    {
      brand
      model
      id
    }
  }
  `
  const INSERT_VEHICLE=gql`
  mutation MyMutation($model:String!,$brand:String!) {
    insert_Vehicles_one(object: {model: $model, brand: $brand}) {
      brand
      id
      model
    }
  }
  `
 
function CarsList()
{
    const columns = [
        { field: 'id', headerName: 'ID', width: 150 },
        {
          field: 'brand',
          headerName: 'Brand',
          width: 150,
          editable: true,
        },
        {
          field: 'model',
          headerName: 'Model',
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

              <button className="btn btn-primary" onClick={()=>{onEdit(params.row.id)}}>Edit</button> 
              
              <button className="btn btn-danger" onClick={()=>{deleteVehicle(params.row.id)}}>Delete</button>
 
              </div>
            );
         }
        },
      ];
  
  const [cars,setCars] = useState({
    brand:"",
    model:""
  })
  const onEdit=(id)=>{
    loadVehicle({ variables: { id:id } });
    console.log(data3);
    //console.assert();
  }
  const [insertVehicleData,{loading2,error2,data2}]=useMutation(INSERT_VEHICLE);
  const [deleteVehicleData,{loading1,error1,data1}]=useMutation(DELETE_VEHICLE);
  const { loading, error, data } = useSubscription(READ_VEHICLE);
  const [loadVehicle,{ loading3, error3, data3}] = useLazyQuery(READ_SINGLE_VEHICLE);
  
  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;
  //console.log(data3);
  
  const rows=data.Vehicles;
    
  const onInputChange=(e)=>{
    setCars({...cars,[e.target.name]:e.target.value})
    //console.log(cars);
  }
  
  const onFormSubmit=(e)=>{
    e.preventDefault();
    insertVehicleData({variables:{model:cars.model,brand:cars.brand}});
        //console.log(cars) 
  }
  const deleteVehicle=(id)=>{
    //console.log(id)
    deleteVehicleData({variables:{id:id}})
  }
  
    return(
    <>
    <Header />
        <div className="container">
          <div className="col-md-4"></div>
          <div className="col-md-4">
              <form onSubmit={(e)=>{onFormSubmit(e)}} className="form-group">
                  <div className="field">
                      <label>Car Brand</label>
                      <input className="form-control" onChange={e=>onInputChange(e)} name="brand" type="text" />
                  </div>
                  <div className="field">
                      <label>Model</label>
                      <input className="form-control" onChange={e=>onInputChange(e)} name="model" type="text" />
                  </div>
                  <button className="btn btn-primary">Save</button>
              </form>
          </div><br />
          <div className="col-md-4"></div>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={9}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                    disableSelectionOnClick
                />
            </div>
        </div>
        </>
    )
}

export default CarsList;