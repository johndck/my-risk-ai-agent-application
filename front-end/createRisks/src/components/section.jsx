// Section.jsx
function Section({ title, bgColor }) {
    return (
      <section className={`h-screen w-full flex items-center justify-center snap-start ${bgColor}`}>
        <h2 className="text-5xl font-black text-white">{title}</h2>
      </section>
    );
  }
  
  export default Section;