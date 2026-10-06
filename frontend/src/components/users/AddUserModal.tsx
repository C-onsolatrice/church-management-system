"use client";


import {
useState
}
from "react";


import api from "@/lib/axios";


export default function AddUserModal(){


const [form,setForm]=useState({

firstName:"",
lastName:"",
email:"",
password:"",
role:"MEMBER"

});



function change(e:any){

setForm({

...form,

[e.target.name]:
e.target.value

});

}



async function submit(){


await api.post(

"/users",

form

);


alert(
"User created successfully"
);


}




return (

<div className="
bg-white
dark:bg-gray-900
p-6
rounded-xl
shadow
">


<h2 className="
text-xl
font-bold
">

Create New User

</h2>



<input

name="firstName"

placeholder="First Name"

className="input"

onChange={change}

/>



<input

name="lastName"

placeholder="Last Name"

className="input"

onChange={change}

/>



<input

name="email"

placeholder="Email"

className="input"

onChange={change}

/>



<input

name="password"

type="password"

placeholder="Password"

className="input"

onChange={change}

/>



<select

name="role"

className="input"

onChange={change}

>


<option value="ADMIN">

Admin

</option>


<option value="PASTOR">

Pastor

</option>


<option value="ACCOUNTANT">

Accountant

</option>


<option value="MEMBER">

Member

</option>


</select>




<button

onClick={submit}

className="
bg-blue-600
text-white
px-5
py-2
rounded
"

>

Create User

</button>



</div>

)

}