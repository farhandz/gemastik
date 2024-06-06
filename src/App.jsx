import { useState } from 'react'
import { IconHome,IconAbc,IconNotebook,IconLanguage,IconUserCircle,IconBrandYoutubeFilled,IconDeviceGamepad2,IconCardsFilled, IconCamera, IconHeartHandshake, } from '@tabler/icons-react';
import Footer from "./component/Footer.jsx"
import signA from "./assets/sign-A.png"
import logo from "./assets/logo.png"
import video from "./assets/video.json"
import handsWithSign from "./assets/hands-with-sign-language-freepik.jpg"
import groupSign from "./assets/rear-view-man-with-raised-hand-group-therapy-freepik.jpg"
import aslSign from "./assets/asl-freepik.jpg"
import './main.css'
import kontenJSON from "./assets/konten.json"

function MarkupFrame(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    let videoId =  (match && match[2].length === 11) ? match[2] : null;

    return <iframe src={"https://www.youtube.com/embed/"+videoId} frameBorder="0"></iframe>;
}
    
function App() {
  const [count, setCount] = useState(0)
  const [boarding,setBoarding] = useState(true)

  let circleMenu=[{
    title:"Kalimat ke Isyarat",
    icon:<IconLanguage/>,
    href:"/terjemah"
  },{
    title:"Kamus Isyarat",
    icon:<IconAbc/>,
    href:"/belajar/huruf"
  },{
    title:"Kuis Isyarat",
    icon:<IconDeviceGamepad2/>,
    href:"/kuis"
  },{
    title:"Edukasi",
    icon:<IconNotebook/>,
    href:"/belajar"
  },
  {
    title:"Isyarat Ke Kamera",
    icon:<IconCamera/>,
    href:"/belajar"
  },
  {
    title:"Bantu Mereka",
    icon:<IconHeartHandshake />,
    href:"/belajar"
  },
  
]

  let articles=[{
    title:"Bahasa Isyarat: Pintu Menuju Komunikasi Inklusif",
    img:handsWithSign,
    href:"/belajar/artikel/1"
  },{
    title:"Perkenalan Diri dalam Bahasa Isyarat",
    img:groupSign,
    href:"/belajar/artikel/2"
  },{
    title:"ASL, Mengenal Bahasa Isyarat Amerika",
    img:aslSign,
    href:"/belajar/artikel/3"
  }]

  setTimeout(()=>{
    setBoarding(false)
  },600)
  return (
    <>
    {boarding?(
    <div className="flex flex-col items-center justify-center">
      <div className="bg-violet-500 w-full lg:w-4/12 h-[100vh] flex flex-col items-center justify-center text-white">
        <img src={logo}/>
        <h1 className="text-2xl font-black">Hand Sign</h1>
        <p>Gerakan tangan, suara jiwa.!!</p>
      </div>
    </div>):
    (
      <div className="flex flex-col items-center justify-center">
      <div className="bg-violet-500 w-full lg:w-4/12 shadow-md">
        <div className="p-6 text-white">
          <h1 className="text-2xl font-black">Selamat datang! 👋</h1>
          <p className="text-xl">Gerakan tangan, suara jiwa.</p>
          {/*<img src={talkingAmico} className="w-60 ml-auto"/>*/}
        </div>
        
        <div className="bg-white p-5 flex flex-col gap-5 rounded-t-2xl">

        <div className="grid bg-violet-400 p-7 grid-cols-3 gap-6 overflow-x-auto sticky bottom-0 rounded-lg overflow-hidden shadow-lg">
          {circleMenu.map(menu => (
            <a key={menu.icon} className="text-center flex flex-col items-center gap-2" href={menu.href}>
              <div className="w-[4em] h-[4em] p-2 rounded-full text-white bg-violet-600 text-blue-500 hover:shadow-lg flex justify-center items-center">
                {menu.icon}
              </div>
              <p className="text-xs text-white">{menu.title}</p>
            </a>
          ))}
        </div>
        <div className="flex flex-col gap-3">
            <div className="flex flex-row justify-between items-center">
              <h1 className="text-lg font-medium">Belajar Lewat Video</h1>
              <a className="bg-orange-300 pr-3 pl-3 p-2 rounded-full text-xs font-medium active:bg-orange-400" href="/belajar">Semua</a>
            </div>
            <div className="flex gap-2 w-full overflow-auto">
              {video.map(vid=>(
                <div className="w-full rounded-lg">
                {MarkupFrame(vid.link)}
                <div className="mt-3 flex flex-col justify-between align-middle">
                  <a href={vid.link} className="font-medium">{vid.title}</a>
                  <div className="text-xs mt-2 flex items-center gap-2">
                    <IconBrandYoutubeFilled className="w-4 text-red-500"/>
                    <a href={vid.link} className="hover:text-red-500">{vid.author}</a>
                  </div>
                </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
                <div className="flex flex-row justify-between w-full rounded-lg bg-blue-200">
                  <div className="p-5">
                    <h1 className="text-xl font-semibold">Terjemahkan  Bahasa Isyarat Ke Text</h1>
                    <p className="text-sm">Ayo bantu mereka agar bisa berkomunikasi!!</p>
                    <br/>
                    <a className="bg-blue-600 p-2 pr-5 pl-5 rounded-full font-medium text-sm text-white" href="/kuis">Coba</a>
                  </div>
                  <div>
                    <img src={signA} className="w-[12em]"/>
                  </div>
                </div>
            </div>
          </div>

     

          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
                <div className="flex flex-row justify-between w-full rounded-lg bg-orange-200">
                  <div className="p-5">
                    <p>Terjemahkan</p>
                    <h1 className="text-xl font-semibold">Terjemahkan kalimat ke bahasa isyarat</h1>
                    <br/>
                    <a className="bg-orange-600 p-2 pr-5 pl-5 rounded-full font-medium text-sm text-white" href="/terjemah">Coba</a>
                  </div>
                  <div>
                    <img src={logo} className="w-[15em]"/>
                  </div>
                </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-row justify-between items-center">
              <h1 className="text-lg font-medium">Artikel</h1>
              <a className="bg-orange-300 pr-3 pl-3 p-2 rounded-full text-xs font-medium active:bg-orange-400" href="/belajar">Semua</a>
            </div>
            <div className="w-full overflow-auto">
            <div className="flex flex-row w-[70em] gap-3">
              {kontenJSON.map(article=>(
                <div className="w-[100%] h-full rounded-lg border hover:shadow-lg mt-3">
                <a href={`/artikel/${article.id}`}>
                <img src={handsWithSign} className="w-full h-[9em] object-cover object-top rounded-lg"/>
                <div className="flex flex-col justify-between align-middle p-3">
                  <h3 className="text-lg font-medium">{article.title}</h3>
                  
                  <div className="flex gap-3">
                    <span className="text-gray-600 text-sm">{article.author}</span>
                    <span className="text-gray-400 text-sm">{article.date}</span>
                  </div>
                </div>
                </a>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
      </div>
    )}
    </>
  )
}

export default App
