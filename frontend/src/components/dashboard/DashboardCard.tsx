export default function DashboardCard(
    {
    title,
    value
    }:{
    title:string,
    value:string
    }){
    
    
    return (
    
    <div className="
    bg-white
    rounded-xl
    shadow
    p-5
    ">
    
    
    <h3 className="text-gray-500">
    {title}
    </h3>
    
    
    <p className="text-3xl font-bold mt-3">
    {value}
    </p>
    
    
    </div>
    
    
    )
    
    }