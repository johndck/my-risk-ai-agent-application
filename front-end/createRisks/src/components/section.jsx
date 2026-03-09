
// Section.jsx

function Section({ title, children, className = '' }) {
    return (
      <section
        className={`snap-start snap-always h-[1200px] bg-slate-100 p-10 border-b border-slate-300 ${className}`}
      >
        <h2 className="text-3xl font-bold">{title}</h2>
        {children}
      </section>
    );
  }
  
  export default Section;





 