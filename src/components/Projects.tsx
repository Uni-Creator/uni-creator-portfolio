const Projects = ({
  sectionRef,
}: {
  sectionRef: (node?: Element | null) => void;
}) => {
  return (
    <div
      ref={sectionRef}
      id="projects"
      className="w-full p-10  mt-10 flex justify-center items-start"
    >
      <div className="w-full flex-center flex sm:flex-nowrap gap-10 flex-wrap-reverse">
        
        <div className="flex-center w-full sm:w-fit ">
          <div className=" flex-center w-full flex-col space-y-5">
            <h1 className="text-6xl w-full text-center font-bold text-[clamp(3rem,4vw,1rem)] leading-15 break-words">
              <span className="heading-bg font-medium">Explore</span> <p className="sm:inline">My Projects</p>
            </h1>
            <p className="text-xl text-text-primary/70">
              Discover My Work: Where AI Meets Innovation.
            </p>
          </div>
        </div>
        <div className="flex-center sm:w-[12vw] sm:h-[12vw] w-[100px]">
          <img
            src="/images/projectSec-1.avif"
            alt="not-found"
            className="object-cover"
          />
        </div>
      </div>
      <div className="min-h-screen"></div>
    </div>
  );
};

export default Projects;
