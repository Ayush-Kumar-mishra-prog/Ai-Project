import React from 'react'


const PrivacyPolicy = () => {
     const [openIndex, setOpenIndex] = React.useState(null);

     const faqs = [
        {
            question: "What is MirrorChat?",
            answer: "MirrorChat is an AI-powered chat platform that allows users to interact with intelligent assistants, generate content, and streamline communication—all in one place with a smooth and modern interface.",
        },
        {
            question: "Is MirrorChat free to use?",
            answer: "Yes, MirrorChat offers a free plan with basic features. You can upgrade anytime to access advanced tools, faster responses, and higher usage limits.",
        },
        {
            question: "How does MirrorChat work?",
            answer: "MirrorChat uses advanced AI models to understand your prompts and generate human-like responses. Simply type your message, and the AI will respond instantly with relevant and helpful information.",
        },
        {
            question: "Is my data safe on MirrorChat?",
            answer: "Yes, your privacy is a priority. MirrorChat follows strict security practices to ensure your conversations and personal data remain safe and confidential.",
        },
    ];
  return (
      <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start justify-center gap-8 px-4 md:px-0 mt-20">
                <img
                    className="max-w-sm w-full rounded-xl h-auto"
                    src="https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&w=830&h=844&auto=format&fit=crop"
                    alt=""
                />
                <div>
                    <p className="text-indigo-200 text-2xl font-medium text-center">FAQ's</p>
                    <h1 className="text-3xl font-semibold  text-gray-300">Looking for answer?</h1>
                    <p className="text-sm text-slate-300 mt-2 pb-4">
                        Here are some common question and there answers about MirrorChat. 
                    </p>
                    {faqs.map((faq, index) => (
                        <div className="border-b border-slate-200 py-4 cursor-pointer" key={index} onClick={() => setOpenIndex(openIndex === index ? null : index)}>
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-medium text-purple-200">
                                    {faq.question}
                                </h3>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${openIndex === index ? "rotate-180" : ""} transition-all duration-500 ease-in-out `}>
                                    <path d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2" stroke="#1D293D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <p className={`text-sm text-slate-300 transition-all duration-500 ease-in-out max-w-md ${openIndex === index ? "opacity-100 max-h-[300px] translate-y-0 pt-4" : "opacity-0 max-h-0 -translate-y-2"}`} >
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </>
  )
}

export default PrivacyPolicy