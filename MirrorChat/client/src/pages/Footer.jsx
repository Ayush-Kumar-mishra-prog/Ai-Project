import React from 'react'

const Footer = () => {
  return (
    <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
            
            <footer className="mt-20 flex flex-col items-center border-t-2 border-gray-300 justify-around w-full py-16 text-sm  text-gray-800/70 rounded-md ">
                <div className="flex items-center gap-8">
                    <a href="#home" className="font-medium text-gray-200 hover:text-black transition-all">
                        Home
                    </a>
                    <a href="#features" className="font-medium text-gray-200 hover:text-black transition-all">
                        Features
                    </a>
                    <a href="#use-cases" className="font-medium text-gray-200 hover:text-black transition-all">
                        Use Cases
                    </a>
                    <a href="/login" className="font-medium text-gray-200 hover:text-black transition-all">
                        Login
                    </a>
                    <a href="#" className="font-medium text-gray-200 hover:text-black transition-all">
                        Community
                    </a>
                </div>
                <div className="flex items-center gap-4 mt-8 text-indigo-500">
                    <a href="https://www.facebook.com/profile.php?id=61564353241438" className="hover:-translate-y-0.5 transition-all duration-300">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="purple" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                    <a href="https://www.instagram.com/async_function___/?hl=en" className="hover:-translate-y-0.5 transition-all duration-300">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 2H7a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5" stroke="purple" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M16 11.37a4 4 0 1 1-7.914 1.173A4 4 0 0 1 16 11.37m1.5-4.87h.01" stroke="purple" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                    <a href="https://www.linkedin.com/in/ayush-kumar-mishra-47bb24362/" className="hover:-translate-y-0.5 transition-all duration-300">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6M6 9H2v12h4zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4" stroke="purple" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                   
                    <a href="https://github.com/Ayush-Kumar-mishra-prog" className="hover:-translate-y-0.5 transition-all duration-300">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" stroke="purple" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9 18c-4.51 2-5-2-7-2" stroke="purple" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                </div>
                <p className="mt-8 text-center text-slate-400 text-lg">Copyright (c) 2026 <a href="https://prebuiltui.com">Ayush kumar mishra</a>. All rights reservered.</p>
            </footer>
        </>
  )
}

export default Footer

