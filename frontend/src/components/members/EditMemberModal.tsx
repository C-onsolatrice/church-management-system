"use client";

import { useState } from "react";
import { updateMember } from "@/lib/members";


interface Props {
  member:any;
  onSuccess:()=>void;
}


export default function EditMemberModal({
  member,
  onSuccess
}:Props){


const [open,setOpen]=useState(false);


const [form,setForm]=useState({

name:member.name,
email:member.email,
phone:member.phone || "",
role:member.role,

});


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

await updateMember(
member.id,
form
);


setOpen(false);

onSuccess();


}

catch(error){

console.log(error);

}

}



return (

<>

<button

onClick={()=>setOpen(true)}

className="
text-blue-600
mr-3
"

>
Edit
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
p-6
rounded-xl
w-full
max-w-md
">


<h2 className="
text-xl
font-bold
mb-5
">

Edit Member

</h2>



<input

name="name"

value={form.name}

onChange={handleChange}

className="
border
p-3
rounded
w-full
mb-3
"

/>



<input

name="email"

value={form.email}

onChange={handleChange}

className="
border
p-3
rounded
w-full
mb-3
"

/>



<input

name="phone"

value={form.phone}

onChange={handleChange}

className="
border
p-3
rounded
w-full
mb-3
"

/>



<select

name="role"

value={form.role}

onChange={handleChange}

className="
border
p-3
rounded
w-full
mb-5
"

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



<div className="
flex
justify-end
gap-3
">


<button

onClick={()=>setOpen(false)}

className="border px-4 py-2 rounded"

>
Cancel
</button>



<button

onClick={handleSubmit}

className="
bg-blue-600
text-white
px-4
py-2
rounded
"

>
Update
</button>


</div>



</div>


</div>

)

}


</>

);

}