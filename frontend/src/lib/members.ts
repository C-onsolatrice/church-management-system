import api from "./axios";


export async function getMembers(page = 1, search = "") {

  const response = await api.get("/users", {
    params: {
      page,
      search,
    },
  });

  return response.data;
}



export async function createMember(data:any){

  const response =
    await api.post("/users", data);

  return response.data;

}

export async function deleteMember(id:string){

    const response =
    await api.delete(`/users/${id}`);
    
    return response.data;
    
    }

export async function updateMember(
 id:string,
 data:any
){

 const response =
 await api.patch(`/users/${id}`, data);


 return response.data;

}



// export async function deleteMember(id:string){

//  const response =
//  await api.delete(`/users/${id}`);


//  return response.data;

// }