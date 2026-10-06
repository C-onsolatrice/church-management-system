"use client";


import {useEffect,useState} from "react";

import api from "@/lib/axios";



export default function EventsPage(){


const [events,setEvents]=useState<any[]>([]);



const [form,setForm]=useState({

title:"",
description:"",
location:"",
date:"",
type:"Service"

});




useEffect(()=>{

loadEvents();

},[]);





async function loadEvents(){

const res = await api.get("/events");

setEvents(res.data);

}





async function saveEvent(){


await api.post("/events",form);


loadEvents();


}



return (

<div className="p-6">


<h1 className="text-3xl font-bold">

Church Events

</h1>




<div className="
bg-white
shadow
rounded
p-5
mt-6
">


<input

className="border p-2 w-full"

placeholder="Event title"

onChange={(e)=>

setForm({

...form,

title:e.target.value

})

}

/>




<textarea

className="border p-2 w-full mt-3"

placeholder="Description"

onChange={(e)=>

setForm({

...form,

description:e.target.value

})

}

/>




<input

className="border p-2 w-full mt-3"

placeholder="Location"

onChange={(e)=>

setForm({

...form,

location:e.target.value

})

}

/>




<input

type="date"

className="border p-2 w-full mt-3"

onChange={(e)=>

setForm({

...form,

date:e.target.value

})

}

/>



<select

className="border p-2 w-full mt-3"

onChange={(e)=>

setForm({

...form,

type:e.target.value

})

}

>


<option>
Service
</option>


<option>
Conference
</option>


<option>
Meeting
</option>


<option>
Youth
</option>


</select>



<button

onClick={saveEvent}

className="
mt-4
bg-blue-600
text-white
px-5
py-2
rounded
"

>

Add Event

</button>



</div>





<div className="
grid
md:grid-cols-3
gap-5
mt-6
">


{

events.map(event=>(


<div

key={event.id}

className="
bg-white
shadow
rounded
p-5
"


>


<h2 className="font-bold text-xl">

{event.title}

</h2>



<p>

{event.description}

</p>


<p className="mt-2">

📍 {event.location}

</p>


<p>

📅 {new Date(event.date)
.toLocaleDateString()}

</p>


<p>

Type: {event.type}

</p>


</div>


))


}



</div>



</div>

)

}