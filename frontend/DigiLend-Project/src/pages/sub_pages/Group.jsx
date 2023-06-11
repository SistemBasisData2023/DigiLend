import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { AiOutlineSearch, AiOutlinePlusCircle } from "react-icons/ai";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import DeleteGroup from "../../components/DeleteGroup";
import AddGroup from "../../components/AddGroup";
import EditGroup from "../../components/EditGroup";

const Group = () => {
  const [groups, setGroups] = useState([]);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [showEditGroup, setShowEditGroup] = useState(false);
  const [showDeleteGroup, setShowDeleteGroup] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const groupsPerPage = 10;

  // Filter data berdasarkan keyword pencarian
  const filteredGroups = groups.filter((group) => {
    const groupValues = Object.values(group).map((value) => value.toString().toLowerCase());
    const searchData = groupValues.join(" ");
    return searchData.includes(searchKeyword.toLowerCase());
  });
  // Menghitung jumlah halaman total
  const totalPages = Math.ceil(filteredGroups.length / groupsPerPage);

  // Menghitung index awal dan akhir data pada halaman saat ini
  const startIndex = (currentPage - 1) * groupsPerPage;
  const endIndex = startIndex + groupsPerPage;
  const currentGroups = filteredGroups.slice(startIndex, endIndex);

  // Fungsi untuk mengubah halaman
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Fungsi untuk meng-handle perubahan input pencarian
  const handleSearch = (e) => {
    setSearchKeyword(e.target.value);
    setCurrentPage(1); // Set halaman kembali ke 1 setelah pencarian berubah
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/kelompok"); // Mengubah URL menjadi "/barang"
      setGroups(data);
      console.log(data);
    } catch (error) {
      console.error("Kesalahan saat mengambil data:", error);
    }
  };

  const handleClickAdd = () => {
    setShowAddGroup((prevState) => !prevState);
  };

  const handleClickEdit = (data) => {
    setSelectedGroup(data);
    setShowEditGroup((prevState) => !prevState);
    setIsDropdownOpen(false);
  };

  const handleClickDelete = (data) => {
    setSelectedGroup(data);
    setShowDeleteGroup((prevState) => !prevState);
    setIsDropdownOpen(false);
  };
  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const sidebarWidth = document.getElementById("sidebar").offsetWidth;
    const groupList = document.getElementById("groupList");
    groupList.style.width = `calc(99.5vw - ${sidebarWidth}px)`;
  }, []);
  return (
    <Fragment>
      <div className="overflow-x-auto">
        <div className="flex flex-col items-center pt-6">
          <h1 className="font-Montserrat font-bold sm:text-5xl text-3xl text-accent">Group List</h1>
        </div>
        <div className="p-6 flex flex-row justify-between">
          <div className="flex">
            <input type="text" placeholder="Search" className="input input-bordered rounded-3xl shadow-xl pr-10" value={searchKeyword} onChange={handleSearch} />
            <AiOutlineSearch className="text-2xl -translate-x-11 translate-y-3" />
          </div>
          <div className="btn btn-ghost flex flex-row items-center gap-3 px-6" onClick={() => handleClickAdd()}>
            <AiOutlinePlusCircle className="text-3xl" />
            <span className="text-lg">Add Group</span>
          </div>
        </div>
        <table id="groupList" className="table table-zebra shadow-xl">
          <thead>
            <tr className="text-white">
              <th>Group's ID</th>
              <th>Group's Name</th>
              <th>Lab Assistant</th>
              <th>Semester</th>
              <th>Academic Year</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentGroups.map((data) => {
              return (
                <tr key={data.id_kelompok} className="text-white">
                  <td>{data.id_kelompok}</td>
                  <td>{data.nama_kelompok}</td>
                  <td>{data.kode_aslab}</td>
                  <td>{data.semester}</td>
                  <td>{data.tahun_ajaran}</td>
                  <td>
                    <div className="dropdown dropdown-end">
                      <label tabIndex={0} className="btn btn-ghost btn-circle shadow-xl" onClick={handleDropdownToggle}>
                        <IoEllipsisVerticalSharp />
                      </label>
                      {isDropdownOpen && (
                        <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                          <li>
                            <a onClick={() => handleClickEdit(data)}>Edit</a>
                          </li>
                          <li>
                            <a onClick={() => handleClickDelete(data)}>Delete</a>
                          </li>
                        </ul>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* Render pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center p-12">
            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
          </div>
        )}
      </div>
      <DeleteGroup isVisible={showDeleteGroup} onClose={() => setShowDeleteGroup(false)} selectedGroup={selectedGroup} />
      <EditGroup isVisible={showEditGroup} onClose={() => setShowEditGroup(false)} selectedGroup={selectedGroup} />
      <AddGroup isVisible={showAddGroup} onClose={() => setShowAddGroup(false)} />
    </Fragment>
  );
};

export default Group;
