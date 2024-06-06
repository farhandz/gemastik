import { useState, useEffect } from 'react';
import { IconCamera, IconLanguage, IconBook, IconQuestionMark, IconDeviceGamepad2 } from '@tabler/icons-react';

export default function Footer({activePath}) {
  const [homeActive, setHomeActive] = useState(false);
  const [belajarActive, setBelajarActive] = useState(false);
  const [hurufActive, setHurufActive] = useState(false);
  const [terjemahActive, setTerjemahActive] = useState(false);
  const [profilActive, setProfilActive] = useState(false);
  const [kuisActive, setKuisActive] = useState(false);

  useEffect(() => {
    const currentPathname = window.location.pathname;

    if(activePath == "belajar"){
      setBelajarActive(true)
    }else{
      setHomeActive(currentPathname === '/');
      setBelajarActive(currentPathname === '/belajar');
      setHurufActive(currentPathname === '/belajar/huruf');
      setTerjemahActive(currentPathname === '/terjemah');
      setProfilActive(currentPathname === '/profil');
      setKuisActive(currentPathname === '/kuis');
    }
  }, []);

  return (
    <>
    <div className="fixed bottom-3 left-1/2 transform -translate-x-1/2 text-center w-full justify-items-center h-16  border-gray-200 dark:bg-gray-700 dark:border-gray-600">
          <div className="grid bg-white border-t  h-full max-w-lg grid-cols-4 mx-auto font-medium">
              <a  type="a" href="/" onClick={() => window.location.href = '/'}  className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group ${homeActive && 'bg-blue-100'}`}>
                  <svg className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                  </svg>
                  <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Home</span>
              </a>
              <a type="a"  href="/kuis"  className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group ${kuisActive && 'bg-blue-100'}`}>
                  <IconDeviceGamepad2   className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
                  <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Kuis</span>
              </a>
              <a type="a" className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
                  <IconCamera   className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
                  <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Terjemahkan</span>
              </a>
              <a type="a"  href="/belajar/huruf" className={`inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group ${hurufActive && 'bg-blue-100'}`}>
                  <IconBook  className="w-5 h-5 mb-2 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500" />
                  <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">Kamus</span>
              </a>
          </div>
      </div>
    
    </>
  );
}
