import './App.css'
import DRRTable from './components/table/DRRTable'

function App() {

  return (
    <>
      <div className='app-container'>
        <h2 className='bg-gray-800 text-gray-200 text-xl text-center px-2 py-4'>
          Table: Daily Run Rate (DRR) - Hunt Digital Media
        </h2>
        <div className='table-container'>
          <div className='px-5 py-8'>
              <div className='p-2 bg-gray-700 text-white'>
                <p className='text-md'>Exclude Date shows depends Start date and End date</p>
                <p className='text-md'>Add records and It will automatically saved on mock server through AJAX request</p>
                <p className='text-md'>You can add, delete and edit the table rows</p>
                <p className='text-md text-red-500'>Sorry, for inconvenient - Due to free mock server, response could be slow to 5-6 seconds</p>
                </div>
          </div>
          <DRRTable />
        </div>
        <footer className='flex justify-between py-3 bg-gray-700 text-gray-200'>
          <p className='px-2'>Copyright {new Date().getFullYear()}</p>
          <p className='px-2'>Designed and Developed by Anish Verma</p>
        </footer>
      </div>
    </>
  )
}

export default App
