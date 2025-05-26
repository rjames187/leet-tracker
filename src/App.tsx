import { useEffect, useState } from 'react';
import './App.css'
import LeetTable from './components/LeetTable'
import { getData } from './data'

function App() {

  const [problems, setProblems] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getData();
        console.log('Fetched problems:', data.length);
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problem data:', error);
      }
    })();
  }, []);

  return (
    <>
      <LeetTable initialProblems={problems}/>
    </>
  )
}

export default App
