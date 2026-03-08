import Section from './section.jsx'



function MainWrapper (){
    return (
        <div className="h-screen overflow-y-auto snap-y snap-mandatory no-scrollbar border border-red-500" >
           

            <Section title="Section landing" bgColor="bg-red-500" />
            <Section title="Section 2" bgColor="bg-blue-500" />
            <Section title="Section 3" bgColor="bg-green-500" />
        </div>
    )
}

export default MainWrapper;