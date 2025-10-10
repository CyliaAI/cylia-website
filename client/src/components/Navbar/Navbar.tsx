const Navbar = () => {
  return (
    <div>
      <div className="flex justify-between items-center px-10 py-4 bg-[#080d5b]">
        <div className="font-bold text-white">Cylia</div>
        <div className="flex items-center gap-3">
          <div className="text-white">Name</div>
          <div className="bg-white rounded-full w-10 h-10"></div>
        </div>
      </div>
    </div>
  )
}

export default Navbar