export default function HowItWorks() {
     const steps = [
       {
         number: "01",
         title: "Browse Events",
         description: "Explore our curated selection of online sessions, in-person events, and hackathons.",
       },
       {
         number: "02",
         title: "Purchase Tickets",
         description: "Securely buy tickets using cryptocurrency or traditional payment methods.",
       },
       {
         number: "03",
         title: "Receive NFT",
         description: "Get a unique NFT ticket delivered to your connected wallet.",
       },
       {
         number: "04",
         title: "Access Benefits",
         description: "Use your NFT to access the event and join exclusive community chat rooms.",
       },
     ]
   
     return (
       <section id="how-it-works" className="py-20 px-6 md:px-12">
         <div className="text-center mb-16">
           <h2 className="text-3xl md:text-4xl font-bold mb-4">
             How It <span className="text-white">Works</span>
           </h2>
           <p className="text-white/80 max-w-2xl mx-auto">
             Our simple process makes it easy to get started with NFT ticketing
           </p>
         </div>
   
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
           {steps.map((step, index) => (
             <div key={index} className="relative">
               <div className="bg-purple-200/30 rounded-xl p-6 h-full">
                 <div className="text-4xl font-bold text-black/30 mb-4">{step.number}</div>
                 <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                 <p className="text-white/80">{step.description}</p>
               </div>
               {index < steps.length - 1 && (
                 <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                   <div className="w-8 h-8 border-t-2 border-r-2 border-white/30 transform rotate-45"></div>
                 </div>
               )}
             </div>
           ))}
         </div>
       </section>
     )
   }
   