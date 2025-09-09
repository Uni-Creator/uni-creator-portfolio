const Projects = ({ sectionRef }: { sectionRef: (node?: Element | null) => void }) => {
  return (
    <div ref={sectionRef} id="projects" className="w-full min-h-screen flex justify-center items-center">Projects</div>
  )
}

export default Projects