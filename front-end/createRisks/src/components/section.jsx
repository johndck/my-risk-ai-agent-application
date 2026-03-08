
// Section.jsx

function Section({ children, bgColor }) {
    return (
      /* snap-start: The anchor point for the scroll engine.
         min-h-[200px]: A safety net so empty sections don't disappear.
         py-20: Vertical padding creates the "breathing room" around your content.
      */
      <section className={`w-full snap-start py-20 px-10 ${bgColor} min-h-[50vh]`}>
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </section>
    );
  }
  
  export default Section;