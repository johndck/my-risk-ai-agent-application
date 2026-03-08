import Section from './section.jsx'



function MainWrapper() {
    return (
        <main className="bg-white">



        

    {/* Using the section component */}

        <Section title="Section reusing component (Fixed 1200px)">
                <p className="mt-4">Scroll down to find the start of Section 2...</p>
        </Section>


          {/* Section 1: Very Tall (Simulating a long article) */}
          <section className="snap-start h-[1200px] bg-slate-100 p-10 border-b border-slate-300">
            <h2 className="text-3xl font-bold">Section 1 (Fixed 1200px)</h2>
            <p className="mt-4">Scroll down to find the start of Section 2...</p>
          </section>
    
          {/* Section 2: Fixed height */}
          <section className="snap-start h-[800px] bg-blue-100 p-10 border-b border-blue-300">
            <h2 className="text-3xl font-bold">Section 2 (Fixed 800px)</h2>
            <p className="mt-4">I should "click" into place when my top hits the browser top.</p>
          </section>
    
          {/* Section 3: Fixed height */}
          <section className="snap-start h-[1400px] bg-green-100 p-10">
            <h2 className="text-3xl font-bold">Section 3 (Fixed 1000px)</h2>
            <p className="mt-4">Final snap point.</p>
          </section>

          {/* Section 4: Fixed height */}
          <section className="snap-start h-[1400px] bg-slate-100 p-10">
            <h2 className="text-3xl font-bold">Section 4(Fixed 1000px)</h2>
            <p className="mt-4">Final snap point.</p>
          </section>


          {/* Section 5: Fixed height */}
          <section className="snap-start h-[1400px] bg-blue-100 p-10">
            <h2 className="text-3xl font-bold">Section 5 (Fixed 1000px)</h2>
            <p className="mt-4">Final snap point.</p>
          </section>


        

          {/* Section 6: Fixed height */}

        </main>
      );
    }
    

export default MainWrapper;