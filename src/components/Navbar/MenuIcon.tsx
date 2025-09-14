import type { MenuIconProps } from "../../utils/utilsType";

export const MenuIcon = ({ isOpen, setIsOpen }: MenuIconProps) => {
  const lineColor = isOpen ? "bg-white" : "bg-slate-700";
  return (
    <div id="menuIcon" className="">
      <button onClick={() => setIsOpen(!isOpen)} className="relative group p-2">
        <div
          className={`outerDiv ${isOpen ? "bg-transparent" : "bg-white shadow-md shadow-purple-500/30"}  `}>
          <div
            className={`innerDiv ${isOpen ? "-rotate-[45deg]" : ""} origin-center`}>
            <div className={`${lineColor} lineUpper ${isOpen ? "-rotate-[90deg]" : ""} origin-right delay-75`}></div>
            <div className={`${lineColor} h-[1vw] max-h-[4px] rounded`}></div>
            <div
              className={`${lineColor} lineBottom ${
                isOpen ? "-rotate-[90deg]" : ""
              } group-focus:h-[px] origin-left delay-75`}
            ></div>
          </div>
        </div>
      </button>
    </div>
  );
};
