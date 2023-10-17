import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Row from "./Row";
import { deleteById, get, getById, save, updatedById} from "../../utils/api";

const DRRTable = () => {
  const currentDate = new Date().toISOString().split("T")[0];
  const nextDate = new Date(new Date().valueOf() + 1000 * 60 * 60 * 24);
  
  // states declaration 
  const [excludeBadge, setExcludeBadge] = useState([]);
  const defaultValues={
    id:uuidv4(),
    startDate: currentDate,
    endDate: nextDate.toISOString().split("T")[0],
    exDate:nextDate.toISOString().split("T")[0],
    excludeDates: excludeBadge,
    leadCount: ''
  };
  const [isEditable, setIsEditable]=useState(false);
  const [isForm, setIsForm] = useState(false);
  const [data, setData] = useState([]);
  const [excludeDate, setExcludeDate] = useState({ min: "", max: "" });
  const [formValues, setFormValues] = useState(defaultValues);
  const [editableValues,setEditableValues]=useState(defaultValues);


  // all utility functions

  // handle form inputs
  const handleChange = (e) => {
    if (e.target.name == "endDate") {
      setExcludeBadge([]);
    }
    if (e.target.name == "exDate") {
      if (formValues.excludeDates.includes(e.target.value)) {
        alert("Already selected");
      } else {
        setExcludeBadge([...excludeBadge, e.target.value]);
      }
    }
    if(formValues.expectedDrr=='Infinity'){
      setFormValues({
        ...formValues,
        expectedDrr:0
      })
      
    }

    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
      excludeDates:excludeBadge,
      month: new Date(formValues.startDate).getMonth() + 1,
      year: new Date(formValues.startDate).getFullYear(),
      days:numberOfDays(formValues.startDate, formValues.endDate)-excludeBadge.length+1,
      lastUpdated: document.lastModified,
    });
  };


  const numberOfDays = (current, next) => {
    const diff = new Date(next).getTime() - new Date(current).getTime();
    return diff / (1000 * 60 * 60 * 24);
  };

  const calcExpectedDRR=(lead,days)=>{
    return lead===(0||1)?1:parseInt(lead/days).toFixed(2);
  }
  const deleteBadge = (index) => {
    let badges=[];
    if(isEditable){
      badges=formValues.excludeDates.filter((_, ind) => ind !== index);
      setFormValues({
        ...formValues,
        excludeDates:badges
      })
    } else {
      badges=excludeBadge.filter((_, ind) => ind !== index);
      setExcludeBadge(badges);
    }
  };

  const validation=()=>{
    if((formValues.startDate&&formValues.endDate&&formValues.leadCount)!==''){
      return true;
    } else {
      alert('Please fill all fields');
      return false
    }
  }

  const deleteRow=async(index)=>{
    if( await deleteById(index)) getData();
  }

  const resetForm=()=>{
    setFormValues(defaultValues);
    setExcludeBadge([]);
  }

  const closeForm=()=>{
    if(isEditable){
      setIsEditable(false);
      setEditableValues(defaultValues);
    } 
    setIsForm(false);
    resetForm();
  }

  const onSave=async()=> {
    if(validation()){
      const updatedFormValues={
        ...formValues,
        expectedDrr:calcExpectedDRR(formValues.leadCount,formValues.days)
      }
      const res=await save(updatedFormValues);
      if(res){
        setData([...data,res.data])
      }
      
      resetForm();
    }
    
  };

  const onEdit=async(id)=>{
    const editData= await getById(id);
    setEditableValues(editData);
    setExcludeBadge(editData.excludeDates);
    setIsEditable(true);
    setIsForm(true);
    resetForm();
  }

  
  const onUpdate=()=>{
    updatedById(formValues.id,{
      ...formValues,
      expectedDrr:calcExpectedDRR(formValues.leadCount,formValues.days),
      lastUpdated:document.lastModified
    })
    .then(res=>{
      if(res)getData();
    })
    .then(()=>{})
    .catch((error)=>alert("Mock API error"));
    
    setIsEditable(false);
    setIsForm(false);
  }

  // GET request for data
  const getData=async()=>{
    const json=await get();
    setData(json)
  }


  // side effects functions

  useEffect(() => {
    const nextDt = new Date(new Date(formValues.startDate).valueOf() + 1000 * 60 * 60 * 24).toISOString().split("T")[0];
    setFormValues({
      ...formValues,
      endDate: isEditable?editableValues.endDate:nextDt,
    });
  }, [formValues.startDate,editableValues]);

  useEffect(() => {
    const stDt = new Date(formValues.startDate).toISOString().split("T")[0];
    const endDt = new Date(formValues.endDate).toISOString().split("T")[0];
    setExcludeDate({
      min: stDt,
      max: endDt,
    });
  }, [formValues.startDate, formValues.endDate]);

useEffect(()=>{
  setFormValues(editableValues);
},[editableValues])

  useEffect(()=>{
    getData();
  },[])

  // Form Component
  const Modal = () => {
    return (
      <div
        className="fixed bottom-0 left-0 top-0 right-0 flex items-center justify-center z-50 p-5 sm:p-12"
        style={{ background: "rgb(17 16 16 / 44%)" }}
      >
        <div className="mx-auto w-full sm:w-[400px] bg-white shadow-xl rounded-xl p-5">
          <div className="flex justify-between items-center pb-4 border-b-4 border-cyan-600 mb-4">
            <p className="font-semibold text-cyan-700 text-xl">Daily Run Rate</p>
            <button
              title="Close form"
              className="bg-cyan-700 rounded"
              onClick={closeForm}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#fff"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

            <div className="mb-6">
              <label
                htmlFor="startDate"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                min={excludeDate.min}
                value={formValues.startDate}
                onChange={handleChange}
                className="shadow-sm bg-gray-50 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500 dark:shadow-sm-light"
                placeholder="name@flowbite.com"
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="endDate"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                min={excludeDate.min}
                value={formValues.endDate}
                onChange={handleChange}
                className="shadow-sm bg-gray-50 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500 dark:shadow-sm-light"
                required
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor="exDate"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Excluded Dates
              </label>
              <input
                type="date"
                id="exDate"
                name="exDate"
                min={excludeDate.min}
                max={excludeDate.max}
                value={formValues.exDate}
                onChange={handleChange}
                className="shadow-sm outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500 dark:shadow-sm-light"
                required
              />
            </div>
            {isEditable?formValues.excludeDates.length > 0 && (
              <div className="flex justify-start items-start flex-wrap gap-2 max-h-[100px] overflow-y-auto mb-3">
                {formValues.excludeDates.map((date, index) => {
                  return badge(date, index);
                })}
              </div>)
              :
              excludeBadge.length > 0 && (
                <div className="flex justify-start items-start flex-wrap gap-2 max-h-[100px] overflow-y-auto mb-3">
                  {excludeBadge.map((date, index) => {
                    return badge(date, index);
                  })}
                </div>
            )}
            <div className="mb-6">
              <label
                htmlFor="leadCount"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Lead Count
              </label>
              <input
                type="number"
                id="leadCount"
                name="leadCount"
                value={formValues.leadCount}
                onChange={handleChange}
                className="shadow-sm outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-cyan-500 dark:focus:border-cyan-500 dark:shadow-sm-light"
                required
              />
            </div>

            {isEditable?
            <button
              onClick={onUpdate}
              className="text-white bg-cyan-700 hover:bg-cyan-800 font-medium rounded-md text-sm px-5 py-2.5 text-center dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
            >
              Update
            </button>
            :
            <button
              onClick={onSave}
              className="text-white bg-cyan-700 hover:bg-cyan-800 font-medium rounded-md text-sm px-5 py-2.5 text-center dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
            >
              Save
            </button>}
            <button
              type="reset"
              onClick={() => setExcludeBadge([])}
              className="ml-3 text-white bg-gray-700 hover:bg-gray-800 font-medium rounded-md text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-cyan-800"
            >
              Clear
            </button>
          
        </div>
      </div>
    );
  };

  // Badge Component for Exclude Dates 
  const badge = (date, index) => {
    return (
      <div
        key={uuidv4()}
        className="flex justify-center items-center gap-2 bg-cyan-100 text-gray-800 border border-cyan-800 text-sm font-medium my-2 px-2.5 py-0.5 rounded-full dark:bg-cyan-900 dark:text-cyan-300"
      >
        {date}

        <button
          title="Close form"
          className="bg-cyan-700 rounded"
          onClick={() => deleteBadge(index)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#fff"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <main className="flex justify-center flex-col">
      {isForm && Modal()}
      <div className="flex gap-2 px-4 py-2">
        <button
          onClick={() => setIsForm(true)}
          className="flex justify-center gap-2 px-3 py-2 bg-cyan-700 hover:bg-cyan-800 text-white rounded-md"
        >
          Add Record
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
       
      </div>
        
      {data.length==0?
        <div className="flex items-start justify-center p-2 mt-12 w-full h-screen">
          <h4 className="text-gray-700 font-semibold text-md">No data... Please add new record</h4>
        </div> 
      :
      <div className="relative overflow-x-auto mx-auto border border-gray-300 w-[98vw] h-[80vh]">
        <table className="relative w-full text-left text-gray-700 dark:text-gray-400">
          <thead className="sticky top-0 bg-gray-200 border border-gray-400 text-sm dark:text-gray-400">
            <tr>
              <th scope="col" className="p-3">
                ID
              </th>
              <th scope="col" className="p-3 text-center">
                Start Date
              </th>
              <th scope="col" className="p-3 text-center">
                End Date
              </th>
              <th scope="col" className="p-3">
                Month & Year
              </th>
              {/* <th scope="col" className="p-3">
                Year
              </th> */}
              <th scope="col" className="p-3 text-center">
                Dates Excluded
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                No. of Days
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Lead Count
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Expected DRR
              </th>
              <th scope="col" className="p-3">
                Last Updated
              </th>
              <th scope="col" className="p-3">
                Action
              </th>
            </tr>
          </thead>
            
          <tbody className="text-sm">
            {data.map((row, ind) => {
              return (
                <Row 
                row={row} 
                ind={ind}
                deleteRow={deleteRow} 
                key={row.id}
                onEdit={onEdit}
                />
              );
            })}
          </tbody>
        </table>
      </div>
      }
    </main>
  );
};

export default DRRTable;
