import { CheckCircle, Users, BookOpen, Trophy, Target, Lightbulb } from 'lucide-react';

const HomeAbout = () => {
  const features = [
    { 
      icon: Users,
      title: "No-Code Agent Creation",
      description: "Build intelligent AI agents visually, without writing a single line of code.",
      color: "from-emerald-500 to-teal-600"
    },
    { 
      icon: Target,
      title: "Customizable Workflows",
      description: "Design agents to handle any task or workflow tailored to your business needs.",
      color: "from-teal-500 to-cyan-600"
    },
    { 
      icon: Trophy,
      title: "High Performance",
      description: "AI agents optimized for speed and accuracy, helping you achieve tasks faster.",
      color: "from-emerald-600 to-green-600"
    },
    { 
      icon: BookOpen,
      title: "Knowledge Integration",
      description: "Connect your agents with documents, databases, and APIs for enriched intelligence.",
      color: "from-green-500 to-emerald-600"
    },
    { 
      icon: Lightbulb,
      title: "Continuous Learning",
      description: "Agents improve over time using feedback and retraining capabilities.",
      color: "from-teal-600 to-emerald-600"
    },
    { 
      icon: CheckCircle,
      title: "Results-Driven Automation",
      description: "Automate repetitive tasks while ensuring reliability and consistency.",
      color: "from-cyan-600 to-teal-600"
    },
  ];

  return (
    <section className="bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 font-poppins py-20 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Build Your <span className="text-emerald-400">AI Agents</span> Visually
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            At <span className="font-semibold text-emerald-400">Cylia</span>, we empower you to{" "}
            <span className="font-semibold text-white">create intelligent AI agents</span> through a fully visual interface, 
            customizable workflows, and automation-ready solutions. Bring your ideas to life without writing a single line of code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="group bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-emerald-800/30 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 hover:-translate-y-2 cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="text-center bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-12 shadow-2xl">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Build Your AI Agent?
          </h3>
          <p className="text-emerald-50 text-lg mb-8 max-w-2xl mx-auto">
            Start creating powerful AI agents that can handle any workflow, automate tasks, and deliver results efficiently.
          </p>
          <a 
            href="/login" 
            className="inline-block px-10 py-4 text-lg font-semibold text-emerald-600 bg-white rounded-2xl hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Get Started Today
          </a>
        </div>
      </div>
    </section>
  );
};

export default HomeAbout;
