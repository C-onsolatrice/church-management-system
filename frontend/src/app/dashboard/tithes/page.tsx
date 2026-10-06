// "use client";


// import {useEffect,useState} from "react";

// import api from "@/lib/axios";



// export default function TithesPage(){


// const [members,setMembers]=useState<any[]>([]);

// const [tithes,setTithes]=useState<any[]>([]);


// const [form,setForm]=useState({

// memberId:"",
// amount:"",
// paymentMethod:"Cash",
// description:""

// });



// useEffect(()=>{

// loadMembers();

// loadTithes();

// },[]);




// async function loadMembers(){

// const res=await api.get("/members");

// setMembers(res.data);

// }



// async function loadTithes(){

// const res=await api.get("/tithes");

// setTithes(res.data);

// }





// async function saveTithe(){


// await api.post("/tithes",{

// ...form,

// amount:Number(form.amount)

// });


// loadTithes();


// }





// return (

// <div className="p-6">


// <h1 className="text-3xl font-bold">

// Tithes Management

// </h1>



// <div className="
// bg-white
// shadow
// rounded
// p-5
// mt-6
// ">


// <select

// className="border p-2"

// onChange={(e)=>

// setForm({

// ...form,

// memberId:e.target.value

// })

// }

// >

// <option>
// Select Member
// </option>


// {

// members.map(member=>(

// <option
// key={member.id}
// value={member.id}
// >

// {member.firstName} {member.lastName}

// </option>


// ))

// }


// </select>




// <input

// className="border p-2 ml-3"

// placeholder="Amount"

// type="number"

// onChange={(e)=>

// setForm({

// ...form,

// amount:e.target.value

// })

// }

// />




// <select

// className="border p-2 ml-3"

// onChange={(e)=>

// setForm({

// ...form,

// paymentMethod:e.target.value

// })

// }

// >

// <option>
// Cash
// </option>

// <option>
// Mobile Money
// </option>

// <option>
// Bank
// </option>


// </select>




// <button

// onClick={saveTithe}

// className="
// bg-green-600
// text-white
// px-5
// py-2
// rounded
// ml-3
// "

// >

// Save Tithe

// </button>


// </div>





// <div className="
// bg-white
// shadow
// rounded
// mt-6
// p-5
// ">


// <table className="w-full">


// <thead>

// <tr>

// <th>Member</th>

// <th>Amount</th>

// <th>Method</th>

// <th>Date</th>

// </tr>

// </thead>



// <tbody>


// {

// tithes.map(tithe=>(


// <tr key={tithe.id}>


// <td>

// {tithe.member.firstName}
// {" "}
// {tithe.member.lastName}

// </td>


// <td>

// ${tithe.amount}

// </td>


// <td>

// {tithe.paymentMethod}

// </td>


// <td>

// {
// new Date(tithe.date)
// .toLocaleDateString()
// }

// </td>


// </tr>


// ))


// }



// </tbody>


// </table>


// </div>


// </div>

// )

// }
"use client";

import {
  useEffect,
  useState,
} from "react";

import api from "@/lib/axios";

interface Member {
  id: string;
  firstName: string;
  lastName: string;
}

interface Tithe {
  id: string;
  amount: number;
  paymentMethod: string;
  createdAt: string;
  member?: Member | null;
}

export default function TithesPage() {
  const [members, setMembers] =
    useState<Member[]>([]);

  const [tithes, setTithes] =
    useState<Tithe[]>([]);

  const [form, setForm] = useState({
    amount: "",
    paymentMethod: "CASH",
    memberId: "",
    branchId: "",
    description: "",
  });

  useEffect(() => {
    loadMembers();
    loadTithes();
  }, []);

  async function loadMembers() {
    try {
      const response =
        await api.get("/members");

      setMembers(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadTithes() {
    try {
      const response =
        await api.get("/tithes");

      setTithes(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function addTithe(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    try {
      await api.post("/tithes", {
        amount: Number(form.amount),
        paymentMethod:
          form.paymentMethod,
        memberId:
          form.memberId || undefined,
        branchId: form.branchId,
        description:
          form.description || undefined,
      });

      setForm({
        amount: "",
        paymentMethod: "CASH",
        memberId: "",
        branchId: "",
        description: "",
      });

      await loadTithes();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="mb-6 text-3xl font-bold">
        Tithes
      </h1>

      <form
        onSubmit={addTithe}
        className="mb-6 grid gap-3 rounded-xl bg-white p-6 shadow dark:bg-gray-900 md:grid-cols-2"
      >
        <input
          type="number"
          min="1"
          placeholder="Amount"
          className="rounded-lg border p-3"
          value={form.amount}
          onChange={(e) =>
            setForm({
              ...form,
              amount: e.target.value,
            })
          }
          required
        />

        <select
          className="rounded-lg border p-3"
          value={form.paymentMethod}
          onChange={(e) =>
            setForm({
              ...form,
              paymentMethod:
                e.target.value,
            })
          }
        >
          <option value="CASH">
            Cash
          </option>
          <option value="MOBILE_MONEY">
            Mobile Money
          </option>
          <option value="BANK">
            Bank
          </option>
        </select>

        <select
          className="rounded-lg border p-3"
          value={form.memberId}
          onChange={(e) =>
            setForm({
              ...form,
              memberId:
                e.target.value,
            })
          }
        >
          <option value="">
            Select Member
          </option>

          {members.map((member) => (
            <option
              key={member.id}
              value={member.id}
            >
              {member.firstName}{" "}
              {member.lastName}
            </option>
          ))}
        </select>

        <input
          className="rounded-lg border p-3"
          placeholder="Branch ID"
          value={form.branchId}
          onChange={(e) =>
            setForm({
              ...form,
              branchId:
                e.target.value,
            })
          }
          required
        />

        <input
          className="rounded-lg border p-3 md:col-span-2"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description:
                e.target.value,
            })
          }
        />

        <button
          type="submit"
          className="rounded-lg bg-green-600 px-4 py-3 text-white"
        >
          Save Tithe
        </button>
      </form>

      <div className="overflow-auto rounded-xl bg-white shadow dark:bg-gray-900">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left">
              <th className="p-4">
                Member
              </th>

              <th className="p-4">
                Amount
              </th>

              <th className="p-4">
                Payment
              </th>

              <th className="p-4">
                Date
              </th>
            </tr>
          </thead>

          <tbody>
            {tithes.map((tithe) => (
              <tr
                key={tithe.id}
                className="border-b"
              >
                <td className="p-4">
                  {tithe.member
                    ? `${tithe.member.firstName} ${tithe.member.lastName}`
                    : "Anonymous"}
                </td>

                <td className="p-4 font-semibold">
                  RWF{" "}
                  {tithe.amount.toLocaleString()}
                </td>

                <td className="p-4">
                  {tithe.paymentMethod}
                </td>

                <td className="p-4">
                  {new Date(
                    tithe.createdAt,
                  ).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}