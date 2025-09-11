export default function Footer() {
  return (
    <footer className=" text-gray-300 py-6 mt-10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Left - Brand */}
        <div className="text-lg w-full text-center flex justify-center font-semibold text-black/30">
          © {new Date().getFullYear()} Uni-Creator. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
