import React from 'react'
import { Link} from 'react-router-dom'
import Lottie from 'lottie-react'
import {animation3, img2} from '../assets'
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';

function Home() {
  return (
    
    <section>
      <div className='rowC'>
        <div>
          <h1 class="pl-12 text-5xl font-extrabold text-gray-700"><span class="text-transparent bg-clip-text bg-gradient-to-r to-green-600 from-red-600">Medical</span> Summary</h1>
          <Lottie className='pt-12' animationData={animation3}/>      
        </div> 

        <motion.div initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="max-h-[35rem] overflow-hidden w-3/5 text-blue-600 ">
          <img className="pl-24 pr-24" src={img2} alt='logo'/>
          <div className='pl-96'>
            <Link to="/input-page" className=' w-1/2 bg-blue-500 hover:bg-blue-700 mb-12 text-white font-bold text-md py-2 px-4 rounded-lg'><a href="Inputdata">Import data</a></Link>
          </div>
          <div className='max-h-50px'>
              <TypeAnimation className='pl-12 mt-8 text-xl font-mono'
              style={{ whiteSpace: 'pre-line', height: '195px', display: 'block' }}
              sequence={[
                2000,
                `Get your medical summary now!!`, // actual line-break inside string literal also gets animated in new line, but ensure there are no leading spaces
                2000,
                `Medical history provides you with the best report of your health with state of the art technology!`,
                2000,
                '',
              ]}
              speed={20}
              repeat={Infinity}
            />
          </div>
            
        </motion.div>
         
      </div>
    </section>
    
  )
}






export default Home
