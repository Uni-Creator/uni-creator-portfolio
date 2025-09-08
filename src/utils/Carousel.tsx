import { useState } from "react";
import { featuresProjects } from "../../constants";

const Carousel = () => {
  const [current, setCurrent] = useState<number>(0);

  const prevSlide = () => {
    setCurrent(current === 0 ? featuresProjects.length - 1 : current - 1);
  };

  const nextSlide = () => {
    setCurrent(current === featuresProjects.length - 1 ? 0 : current + 1);
  };

  const goToSlide = (index:number) => setCurrent(index);

  return (
    <div className="relative sm:w-[80%] w-full bg-gray-900 text-white rounded-lg p-16">
      {/* Carousel slides */}
      <div className="relative  min-h-[250px]">
        {featuresProjects.map((project, index) => (
          <div
            key={index}
            className={`absolute flex space-x-5 justify-center items-center inset-0 transition-all duration-700 ease-in-out ${
              index === current ? "block" : "hidden"
            }`}
          >
            <h2 className="text-xl w-1/2 font-bold mb-4 text-center">{project.title}</h2>
            <div className="h-[200px] w-[1px] bg-white"></div>
            <ul className="list-disc w-full list-inside marker:text-slate-500 space-y-2">
              {project.features.map((feature, idx) => (
                <li key={idx}>
                    <p className="inline font-bold">{feature.topic} : </p>
                    <span className="">{feature.work}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {featuresProjects.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === current ? "bg-white" : "bg-gray-500"
            }`}
            onClick={() => goToSlide(index)}
          ></button>
        ))}
      </div>

      {/* Navigation */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-10 transform -translate-y-1/2 text-white/20 cursor-pointer hover:text-white/50 text-6xl font-bold"
      >
        &#8249;
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-10 transform -translate-y-1/2 text-white/20 cursor-pointer hover:text-white/50 text-6xl font-bold"
      >
        &#8250;
      </button>
    </div>
  );
};

export default Carousel;
