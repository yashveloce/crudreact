import React,{useState} from 'react';
import { useHistory } from 'react-router';
import auth from '../auth';
import {
    useQuery,
    gql,
    useMutation
  } from "@apollo/client";
import Header from '../components/Header';

const LOGIN_MUTATION = gql`
query MyQuery {
    User {
      username
      password
    }
  }
`;

const Login=() =>
{
    const history = useHistory();
    const [formState, setFormState] = useState({
        username:'',
        password: ''
    });
    const {loading,error,data} = useQuery(LOGIN_MUTATION);
    //console.log(data.User);
    const FormSubmit=(e)=>
    {
        e.preventDefault();
        //console.log(formState);
        Array.isArray(data.User) && data.User.map((user)=>{
            if(formState.username === user.username && formState.password === user.password)
            {
                //console.log("-----------------"+localStorage.getItem("authenticated"));
                auth.login(()=>{
                    history.push("/list")
                })
                //console.log("-----------------"+localStorage.getItem("authenticated"));
            }
            else
            {
                console.log("Fail");
            }
        })
    }
    
    
    const onInputChange=(e)=>{
        setFormState({...formState,[e.target.name]:e.target.value})
    }
    //const authToken = localStorage.getItem(AUTH_TOKEN);
    
    //console.log(data)
    return (
        <div className="container">
            <div>
                <form onSubmit={(e)=>{FormSubmit(e)}}>
                <div class="form-group">
                    <label>Username</label>
                    <input type="text" defaultValue={formState.username} onChange={(e)=>{onInputChange(e)}} name="username" className="form-control" placeholder="Enter Username" />
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="text" defaultValue={formState.password} onChange={(e)=>{onInputChange(e)}} name="password" className="form-control" placeholder="Enter Password" />
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
                </form>
            </div>
        </div>
        
    )
}

export default Login;