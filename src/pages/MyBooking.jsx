import {Link} from "react-router-dom";
import {AiOutlinePlusCircle,
  AiFillEdit, 
  AiFillCreditCard, 
  AiOutlineHeart,
  AiOutlineSetting,
  AiOutlineUnorderedList,
  AiFillHeart } from "react-icons/ai";
import {FiUnlock, FiUser, FiLogOut, FiSearch} from "react-icons/fi";
import {AiTwotoneCalendar} from "react-icons/ai";
import {SiArtixlinux} from "react-icons/si";
import MenuBar1 from "../components/MenuBar1";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout} from "../redux/reducers/auth";
import http from "../helper/http";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Footer from "../components/Footer";
import { BsFilterLeft } from "react-icons/bs";
import User from "../assets/user.png";

function MyBooking(){
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const [menuBar, setMenuBar] = React.useState("");
  const [profile, setProfile] = React.useState({});
  const [historyData, setHistoryData] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [limit, setLimit] = React.useState();
  const [page, setPage] = React.useState(1);
  const [sortBy, setSortBy] = React.useState("");
  const [totalPage, setTotalPage] = React.useState();

  async function getHistory(search, page, limit, sortBy){
    try {
      const {data} = await http(token).get(`/historys?search=${search}&page=${page}&limit=${limit}&sortBy=${sortBy}`);
      setHistoryData(data.results);
      setTotalPage(data.pageInfo.totalPage);
    } catch (error) {
      const message = error?.response?.data?.message;
      if(message){
        console.log(message);
      }
    }
  }
    
  React.useEffect(()=>{
    async function getProfileUser(){
      try {
        const {data} = await http(token).get("/profile");
        setProfile(data.results);
      } catch (error) {
        const message = error?.response?.data?.message;
        if(message){
          console.log(message);
        }
      }
    }
    getProfileUser();
    getHistory(search, page, limit, sortBy);
  },[token, search, page, limit, sortBy]);

  function doLogout(){
    dispatch(logout());
    navigate("/");
  }

  const deleteHistory = async id => {
    try {
      await http(token).delete(`/historys/${id}`);
      getHistory(search, page, limit, sortBy);
    } catch (error) {
      const message = error?.response?.data?.message;
      console.log(message);
    }
  };

  const addRemoveWishlist = async id => {
    try {
      const form = new URLSearchParams({eventId: id}).toString();
      const {data} = await http(token).get(`/wishList/${id}`);
      if (data.results) {
        await http(token).delete(`/wishList/${id}`);
        getHistory(search, page, limit, sortBy);
      } else if (data.message === "wishlist not found") {
        await http(token).post("/wishList", form);
        getHistory(search, page, limit, sortBy);
      }
    } catch (err) {
      const message = err?.response?.data?.message;
      if (message) {
        console.log(message);
      }
    }
  };
  return(
    <>
      <nav className="flex w-full items-center justify-between px-10 py-4">
        <div className="flex-1 flex items-center justify-between w-full md:w-0">
          <MenuBar1 showMenuBarFunc ={setMenuBar} />
          <Link to="/">
            <div className="flex items-center">
              <SiArtixlinux size={50} className="text-primary filter blur-[2.8px] pr-1"/>
              <div className="text-primary text-[24px] font-bold" >TIX</div><div className="text-accent text-[24px] font-bold" >Event</div>
            </div>
          </Link>
        </div>
        <div className="flex-1 hidden lg:block">
          <ul className="hidden lg:flex gap-x-10 font-bold text-[16px]">
            <li className="text-primary hover:text-accent"><Link to="/">Home</Link></li>
            <li className="text-primary hover:text-accent"><Link to="/CreateEvent">Create Event</Link></li>
            <li className="text-primary hover:text-accent"><Link to="/Location">Location</Link></li>
          </ul>
        </div>
        <Link to="/Profile" className="hidden lg:flex">
          <div className="hidden lg:flex flex-1">
            <div className="inline-block rounded-full p-0.5 bg-gradient-to-br from-yellow-500 to-blue-400 mx-3 ">
              {profile?.picture && <img src={profile?.picture || User} alt={profile?.fullName} className='w-12 h-12 border-4 border-white rounded-full' />}
            </div>
            <div className="text-secondary self-center font-bold text-[16px]">{profile?.fullName}</div>
          </div>
        </Link>
      </nav>
      <main className="px-[30px] md:flex md:bg-[#F4F7FF] p-[20px] md:px-[75px] md:py-[75px]">
        <aside id="menuBar" className={menuBar}>
          <div className="flex flex-col xl:flex-row items-center gap-3 mb-[56px]">
            <div className="inline-block rounded-full p-0.5 bg-gradient-to-br from-yellow-500 to-blue-400">
              {profile?.picture && <img src={profile?.picture || User} alt={profile?.fullName} className='w-12 h-12 border-4 border-white rounded-full' />}
            </div>
            <div><h1  className="font-bold text-[14px] text-secondary">{profile?.fullName}</h1><p className="text-secondary">{profile?.profession}, {profile?.id}</p></div>
          </div>
          <div className="font-[500] text-[14p x]">
            <ul className="cursor-pointer">
              <li className="flex gap-3 py-3 text-primary "><FiUser size={20}/>Profile</li>
              <li className="mx-5 py-3 text-primary">
                <ul>
                  <li className="flex gap-3 py-3 text-primary"><AiFillCreditCard size={20}/><Link to="/PaymentMethod">Card</Link></li>
                  <li className="flex gap-3 py-3 text-primary"><AiFillEdit size={20}/><Link to="/Profile">Edit Profil</Link></li>
                  <li className="flex gap-3 py-3 text-primary"><FiUnlock size={20}/><Link to="/ChangePassword">Change Password</Link></li>
                </ul>
              </li>
              <li className="flex gap-3 py-3 text-primary"><AiOutlinePlusCircle size={20}/><Link to="/CreateEvent">Creat Event</Link></li>
              <li className="flex gap-3 py-3 text-accent"><AiOutlineUnorderedList size={20}/><Link to="/Booking">My Booking</Link></li>
              <li className="flex gap-3 py-3 text-primary"><AiOutlineHeart size={20}/><Link to="/Wishlist">My Wishlist</Link></li>
              <li className="flex gap-3 py-3 text-primary"><AiOutlineSetting size={20}/>Seting</li>
              <button onClick={doLogout} className="flex gap-3 py-3 text-primary pb-10"><FiLogOut size={20}/>Log out</button>
            </ul>
          </div>
        </aside>  

        <article className="relative inline-block w-full bg-white p-[20px] md:px-[100px] md:py-[70px] rounded-2xl flex-1">
          <div className="md:flex md:justify-between mb-6">
            <div className="mb-[30px] font-bold text-[20px] text-secondary">My Booking</div>
            <div className="font-[400] text-[14px]">
              <button className="px-5 rounded-2xl btn btn-primary shadow-lg flex gap-3 py-3 w-[150px] md:w-full text-white"><AiTwotoneCalendar size={20}/>March</button>
            </div>
          </div>
          <div className="w-full relative flex flex-row mb-5 items-center">
            <input onChange={(e)=> setSearch(e.target.value)} type="text" placeholder="Search History.." className="input input-bordered w-full drop-shadow-lg px-12 text-black" />
            <div className="dropdown dropdown-bottom dropdown-end">
              <label tabIndex={0} className="btn m-1 drop-shadow-lg"><BsFilterLeft size={28} className="text-white"/></label>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 flex flex-col gap-1">
                <label>Sort</label>
                <div>
                  <label className="text-secondary font-medium">SortBy:</label>
                  <div className="flex gap-1">
                    <button onClick={(e)=> setSortBy(e.target.value)} value={"ASC"} className="btn btn-active w-[70px] normal-case text-white">ASC</button>
                    <button onClick={(e)=> setSortBy(e.target.value)} value={"DESC"} className="btn btn-active w-[70px] normal-case text-white">DESC</button>
                  </div>
                </div>
                <label className="text-secondary font-medium">Limit:</label>
                <select className="select select-ghost w-full max-w-xs text-primary" onChange={(e)=> setLimit(e.target.value)}>
                  <option>5</option>
                  <option>10</option>
                  <option>15</option>
                  <option>20</option>
                </select>
              </ul>
            </div>
            <FiSearch size={25} className="text-neutral absolute left-[10px] top-3"/>
          </div>
          {historyData.length < 1 && <div className="flex flex-col text-center h-full py-[100px] md:py-auto md:px-auto">
            <div className="font-bold text-[26px] text-secondary">No tickets bought</div>
            <div className="text-primary justify-center font-[400] text-[16px]">It appears you haven’t bought any tickets yet. Maybe try searching these?</div>
          </div>}
          {historyData.length > 0 && <>
            {historyData.map(event =>{
              return(
                <div key={`hstory-data${event.id}`}>
                  <div className="flex gap-x-10" >
                    <div className="self-center w-[50px] flex-1">
                      <p className="font-bold text-[24px] text-accent">{moment(event.date).format("DD")}</p>
                      <p className="font-[400] text-[16px] text-primary">{moment(event.date).format("ddd")}</p>
                    </div>
                    <div className="flex-initial w-full">
                      <h1 className="pb-2 font-[600] text-[24px] text-secondary">{event.title}</h1>
                      <p className="pb-2 font-[400] text-[14px] text-primary">{event.location}</p>
                      <p className="pb-2 font-[400] text-[14px] text-primary">{moment(event.date).format("MMMM Do YYYY, h:mm")}</p>
                      <div className="flex gap-1">
                        <label className="btn bg-white hover:bg-white border-0 text-accent normal-case">Detail</label>
                        <label htmlFor="my_modal_6" className="btn bg-white hover:bg-white border-0 text-accent normal-case">Delete</label>
                        {/* modal */}
                        <input type="checkbox" id="my_modal_6" className="modal-toggle" />
                        <div className="modal">
                          <div className="modal-box">
                            <h3 className="font-bold text-lg text-black">Delete Booking History!</h3>
                            <p className="py-4 text-black">Are you sure you want to delete booking history!</p>
                            <div className="modal-action">
                              <label htmlFor="my_modal_6" className="btn bg-error normal-case font-md text-white" type="submit" onClick={()=>deleteHistory(event?.id)}>Delete</label>
                              <label htmlFor="my_modal_6" className="btn normal-case font-md text-white">Close!</label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {event.eventId === event.idEvent && <button onClick={() => addRemoveWishlist(event.eventId)} className="w-[32px] flex-1 text-neutral"><AiOutlineHeart size={30}/></button>}
                    {event.eventId !== event.idEvent && <button onClick={() => addRemoveWishlist(event.eventId)} className="w-[32px] flex-1 text-error"><AiFillHeart size={30}/></button>}
                  </div>
                  <hr className="w-full my-6"/>
                </div>
              );
            })}
            <div className="absolute bottom-6 w-full flex gap-6 items-center">
              {page === 1 ? <button className="btn btn-neutral w-[80px] h-[40px] rounded-lg justify-center text-center font-semibold text-white normal-case">Back</button>
                : <button onClick={()=> setPage(page - 1)} className="btn btn-primary w-[80px] h-[40px] rounded-lg justify-center text-center font-semibold text-white normal-case">Back</button>}
              <p className="font-semibold text-primary text-lg">{page}</p>
              {page === totalPage ? <button className="btn btn-neutral w-[80px] h-[40px] rounded-lg justify-center text-center font-semibold text-white normal-case">Next</button>
                : <button onClick={()=> setPage(page + 1)} className="btn btn-primary w-[80px] h-[40px] rounded-lg justify-center text-center font-semibold text-white normal-case">Next</button>}
            </div>
          </>}
        </article>
      </main>
      <Footer />
    </>
  );
}

export default MyBooking;