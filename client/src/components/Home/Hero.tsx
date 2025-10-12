import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const [currID, setCurrID] = useState(0);

  const heroSections = [
    {
      hl: "Build AI Agents Visually — No Code, Just Flow",
      shl: "Design, connect, and deploy intelligent agents in minutes with an intuitive drag-and-drop interface.",
      cta: "Start Building"
    },
    {
      hl: "Your Visual Canvas for AI Automation",
      shl: "Create complex AI workflows effortlessly — connect GPT models, APIs, and custom logic all in one place.",
      cta: "Try It Now"
    },
    {
      hl: "From Idea to Intelligent Agent — Instantly",
      shl: "Turn your ideas into fully functional AI agents using our visual editor and modular workflow builder.",
      cta: "Build Your First Agent"
    },
    {
      hl: "Empower Your Projects with AI — Visually",
      shl: "No complex coding required. Design smart agents that understand, automate, and act — right from your browser.",
      cta: "Get Started Free"
    },
    {
      hl: "The Next Generation of AI Development",
      shl: "Streamline AI creation with a powerful visual builder that integrates models, data, and APIs seamlessly.",
      cta: "Launch Your Workspace"
    },
    {
      hl: "Create, Connect, and Deploy AI Agents Effortlessly",
      shl: "Our visual builder lets you craft intelligent agents that reason, respond, and automate — faster than ever.",
      cta: "Build Visually"
    },
    {
      hl: "Bring Your AI Ideas to Life — Without Code",
      shl: "Design interactive AI agents using our modular canvas. Simple, fast, and made for everyone.",
      cta: "Start For Free"
    },
    {
      hl: "Visually Build the Future of AI",
      shl: "Combine models, workflows, and APIs into powerful AI systems — all without writing a single line of code.",
      cta: "Create Your Agent"
    }
  ];

  const nextSlide = (i?: number) => {
    if (typeof i === "number") {
      setCurrID(i);
    } else {
      setCurrID(prev => (prev + 1) % heroSections.length);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrID(prev => (prev + 1) % heroSections.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroSections.length]);

  return (
    <section className="relative">
      <div className='bg-[url(./bg-cook.jpeg)] bg-cover bg-center h-[80vh] z-0'></div>
      <div className='absolute top-0 left-0 w-full flex h-full bg-linear-270 from-black/50 via-50% to-emerald-600'>
        <div className='flex z-[1] font-poppins gap-10 text-neutral-200 pl-4 pt-[15vh] relative'>
          {heroSections.map((elem, i) => (
            <div 
              key={i}
              className={`flex flex-none flex-col transition-opacity duration-700 ease-in-out gap-10 w-[500px] absolute ${
                i === currID ? "opacity-100 z-[2] motion-preset-slide-up" : "opacity-0"
              }`}
            >
              <p className='text-5xl font-bold'>{elem.hl}</p>
              <p className='text-xl text-neutral-300 font-semibold'>{elem.shl}</p>
              <button 
                onClick={() => navigate('/workspace')} 
                className='cursor-pointer py-4 px-6 bg-white text-emerald-400 motion-duration-200 motion-ease-in-out font-semibold rounded-2xl hover:text-white hover:bg-emerald-400 transition-all duration-300'
              >
                {elem.cta}
              </button>
            </div>
          ))}
        </div>

        <div className='flex justify-center absolute gap-[40px] bottom-[40px] w-[500px]'>
          {heroSections.map((_, i) => (
            <button
              onClick={() => nextSlide(i)}
              key={i}
              className={`h-4 w-4 rounded-full cursor-pointer transition-all duration-300 ease-in-out z-[2] ${
                i === currID ? "bg-white w-8" : "bg-white/40 hover:bg-white/80"
              }`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero;
