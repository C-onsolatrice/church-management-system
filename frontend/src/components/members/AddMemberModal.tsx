"use client";

import { useState } from "react";
import { createMember } from "@/lib/members";


interface Props {
  onSuccess: () => void;
}


export default function AddMemberModal({
  onSuccess,
}: Props) {


const [open,setOpen] = useState(false);


const [form,setForm] = useState({

name:"",
email:"",
phone:"",
password:"",
role:"MEMBER",
branchId:"",

});


const [loading,setLoading] = useState(false);



function handleChange(
e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
){

setForm({
...form,
[e.target.name]:e.target.value
});

}



async function handleSubmit(){

try{

setLoading(true);


await createMember(form);


setOpen(false);


setForm({

name:"",
email:"",
phone:"",
password:"",
role:"MEMBER",
branchId:"",

});


onSuccess();


}

catch(error){

console.log(error);

}

finally{

setLoading(false);

}

}



return (

<>


<button

onClick={()=>setOpen(true)}

className="
bg-blue-600
text-white
px-4
py-2
rounded-lg
"

>
+ Add Member
</button>



{
open && (

<div className="
fixed
inset-0
bg-black/40
flex
items-center
justify-center
">


<div className="
bg-white
rounded-xl
p-6
w-full
max-w-md
">


<h2 className="
text-xl
font-bold
mb-5
">

Add New Member

</h2>



<input

name="name"

placeholder="Full name"

value={form.name}

onChange={handleChange}

className="border p-3 rounded w-full mb-3"

/>



<input

name="email"

placeholder="Email"

value={form.email}

onChange={handleChange}

className="border p-3 rounded w-full mb-3"

/>



<input

name="phone"

placeholder="Phone"

value={form.phone}

onChange={handleChange}

className="border p-3 rounded w-full mb-3"

/>



<input

name="password"

type="password"

placeholder="Password"

value={form.password}

onChange={handleChange}

className="border p-3 rounded w-full mb-3"

/>



<select

name="role"

value={form.role}

onChange={handleChange}

className="border p-3 rounded w-full mb-3"

>


<option value="MEMBER">
Member
</option>

<option value="PASTOR">
Pastor
</option>

<option value="TREASURER">
Treasurer
</option>

<option value="ADMIN">
Admin
</option>


</select>



<input

name="branchId"

placeholder="Branch ID"

value={form.branchId}

onChange={handleChange}

className="border p-3 rounded w-full mb-5"

/>



<div className="
flex
justify-end
gap-3
">


<button

onClick={()=>setOpen(false)}

className="
px-4
py-2
border
rounded
"

>
Cancel
</button>



<button

disabled={loading}

onClick={handleSubmit}

className="
bg-blue-600
text-white
px-4
py-2
rounded
"

>

{
loading ? "Saving..." : "Save"
}

</button>


</div>


</div>


</div>

)

}


</>

);

}