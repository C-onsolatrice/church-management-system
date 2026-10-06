"use client";


import {
 LineChart,
 Line,
 XAxis,
 YAxis,
 CartesianGrid,
 Tooltip,
 ResponsiveContainer
} from "recharts";


import {
 useQuery
} from "@tanstack/react-query";


import {
 getMonthlyTithes
} from "@/lib/dashboard";



export default function RevenueChart(){


const {
 data,
 isLoading
}=useQuery({

 queryKey:[
  "monthly-tithes"
 ],

 queryFn:
 getMonthlyTithes

});



if(isLoading){

 return (
  <div>
   Loading chart...
  </div>
 )

}



const chartData =
data?.map((item:any)=>({

 month:
 new Date(item.month)
 .toLocaleString(
  "default",
  {
   month:"short"
  }
 ),

 amount:
 Number(item.total)

}));




return (

<div
className="
bg-white
rounded-xl
shadow
p-6
mt-6
"
>


<h2
className="
text-xl
font-semibold
mb-5
"
>
Monthly Tithes
</h2>



<ResponsiveContainer
width="100%"
height={350}
>


<LineChart
data={chartData}
>


<CartesianGrid
strokeDasharray="3 3"
/>


<XAxis
dataKey="month"
/>


<YAxis
/>


<Tooltip
formatter={(value)=> 
`${value} RWF`
}
/>


<Line

type="monotone"

dataKey="amount"

strokeWidth={3}

/>


</LineChart>


</ResponsiveContainer>


</div>

);

}