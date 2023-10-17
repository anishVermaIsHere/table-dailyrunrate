const Row = ({
    row,
    ind,
    deleteRow,
    onEdit
}) => {


  return (
    <tr
      className={ind % 2 == 0
          ? `bg-white border-b border-gray-300 hover:bg-gray-700 hover:text-gray-200 cursor-pointer`
          : `bg-gray-100 border border-gray-300 hover:bg-gray-700 hover:text-gray-200 cursor-pointer`
        }
    >
      <td className="px-3 py-1.5 max-w-[15px] text-center">
        {row.id?row.id.slice(0,3):""}...
      </td>
      <td className="px-3 py-1.5 text-center">{row.startDate}</td>
      <td className="px-3 py-1.5 text-center">{row.endDate}</td>
      <td className="px-3 py-1.5">
        <span>{row.month}, </span>
        <span>{row.year}</span>
      </td>
      {/* <td className="px-3 py-1.5">{row.year}</td> */}
    <td className="flex justify-center flex-wrap flex-col lg:flex-row gap-1 w-[120px] lg:w-auto px-3 py-1.5 text-xs mx-w[400px]">
        {row.excludeDates.length==0?"--":
        row.excludeDates.map((date) => (
          <span key={date} className="bg-cyan-100 text-gray-800 border border-cyan-500 font-medium text-center px-1.5 py-0.5 mr-2 rounded-full">
            {date}
          </span>
        ))}
      </td>
      <td className="px-3 py-1.5 text-center">{row.days}</td>
      <td className="px-3 py-1.5 text-center">{row.leadCount}</td>
      <td className="px-3 py-1.5 text-center">{row.expectedDrr}</td>
      <td className="px-3 py-1.5">{row.lastUpdated}</td>
      <td className="px-3 py-1.5">
        <div className="flex items-center">
          <span 
          className=" text-cyan-500 cursor-pointer mr-2"
          onClick={()=>onEdit(row.id)}
          title="Edit row">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </span>
          <span 
          onClick={()=>deleteRow(row.id)}
          className=" text-red-500 cursor-pointer mr-2" 
          title="Delete row">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </span>
        </div>
      </td>
    </tr>
  );
};

export default Row;
