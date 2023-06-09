import { BsWhatsapp, BsFacebook, BsCameraFill } from "react-icons/bs"
import {AiOutlinePlusCircle,
        AiFillEdit, 
        AiFillCreditCard, 
        AiFillTwitterCircle, 
        AiFillInstagram,
        AiOutlineHeart,
        AiOutlineSetting,
        AiOutlineUnorderedList, } from "react-icons/ai"
import {Link, useNavigate} from "react-router-dom"
import {FiUnlock, FiUser, FiLogOut} from "react-icons/fi"
import {SiArtixlinux} from "react-icons/si"
import MenuBar1 from "../components/MenuBar1"
import React from "react"
import http from "../helper/http"
import moment from "moment"
import { useDispatch, useSelector } from "react-redux"
import { logout} from "../redux/reducers/auth"
import { Formik } from "formik"

function Profile(){
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const token = useSelector(state => state.auth.token)
    const [menuBar, setMenuBar] = React.useState('')
    const [profile, setProfile] = React.useState({})
    const [editEmail, setEditEmail] = React.useState(false)
    const [editUsername, setEditUsername] = React.useState(false)
    const [editPhoneNumber, setEditPhoneNumber] = React.useState(false)
    const [editBirthDate, setEditBirthDate] = React.useState(false)
    const [selectedPIcture, setSelectedPicture] = React.useState({})
    
    React.useEffect(()=>{
        async function getProfileUser(){
            try {
                const {data} = await http(token).get("/profile")
                setProfile(data.results)
                console(data)
            } catch (error) {
                const message = error?.response?.data?.message
                if(message){
                    console.log(message)
                }
            }
        }
        getProfileUser()
    },[])

    const editProfile = async (values)=>{
        const form = new FormData()
        Object.keys(values).forEach((key) => {
            if(values[key]){
                form.append(key, values[key])
            }
            
        })
        if(selectedPIcture){
            form.append("picture", selectedPIcture)
        }
        const {data} = await http(token).patch("/profile", form, {
            headers: {
                "Content-Type" : "multipart/form-data"
            }
        })
        setProfile(data.result)
        console.log(data.result)
        setEditUsername(false)
        setEditEmail(false)
        setEditPhoneNumber(false)
        setEditBirthDate(false)
    }

    React.useEffect(()=>{
        console.log(selectedPIcture)
    },[selectedPIcture])
    function doLogout(){
        dispatch(logout())
        navigate("/")
    }
    
    return(
        <div>
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
                        <div className="inline-block w-12 h-12 rounded-full p-0.5 bg-gradient-to-br from-yellow-500 to-blue-400 mx-3 ">
                            {profile?.picture && (<img className='w-full h-full object-cover border-4 border-white rounded-full' src={profile?.picture.startsWith('https')? profile?.picture : `http://localhost:8888/uploads/${profile?.picture}`} alt={profile?.fullName} />)}
                        </div>
                        <div className="text-secondary self-center font-bold text-[16px]">{profile?.fullName}</div>
                    </div>
                </Link>
            </nav>
            <main className="px-[30px] md:flex md:bg-[#F4F7FF] p-[20px] md:px-[75px] md:py-[75px]">
                <aside id="menuBar" className={menuBar}>
                    <div className="flex flex-col xl:flex-row items-center gap-3 mb-[56px]">
                        <div className="inline-block w-12 h-12 rounded-full p-0.5 bg-gradient-to-br from-yellow-500 to-blue-400">
                        {profile?.picture && (<img className='object-cover w-full h-full border-4 border-white rounded-full' src={profile?.picture.startsWith('https')? profile?.picture : `http://localhost:8888/uploads/${profile?.picture}`} alt={profile?.fullName} />)}
                        </div>
                        <div><h1  className="font-bold text-[14px] text-secondary">{profile?.fullName}</h1><p className="text-secondary">{profile?.profession}, {profile?.id}</p></div>
                    </div>
                    <div className="font-[500] text-[14p x]">
                        <ul className="cursor-pointer">
                            <li className="flex gap-3 py-3 text-primary "><FiUser size={20}/>Profile</li>
                            <li className="mx-5 py-3 text-primary">
                                <ul>
                                    <li className="flex gap-3 py-3 text-primary"><AiFillCreditCard size={20}/><Link to="/PaymentMethod">Card</Link></li>
                                    <li className="flex gap-3 py-3 text-accent"><AiFillEdit size={20}/><Link to="/Pofile">Edit Profil</Link></li>
                                    <li className="flex gap-3 py-3 text-primary"><FiUnlock size={20}/><Link to="/ChangePassword">Change Password</Link></li>
                                </ul>
                            </li>
                            <li className="flex gap-3 py-3 text-primary"><AiOutlinePlusCircle size={20}/><Link to="/CreateEvent">Creat Event</Link></li>
                            <li className="flex gap-3 py-3 text-primary"><AiOutlineUnorderedList size={20}/><Link to="/Booking">My Booking</Link></li>
                            <li className="flex gap-3 py-3 text-primary"><AiOutlineHeart size={20}/><Link to="/Wishlist">My Wishlist</Link></li>
                            <li className="flex gap-3 py-3 text-primary"><AiOutlineSetting size={20}/>Seting</li>
                            <button onClick={doLogout} className="flex gap-3 py-3 text-primary pb-10"><FiLogOut size={20}/>Log out</button>
                        </ul>
                    </div>
                </aside> 
                <Formik initialValues={{ 
                        fullName: profile?.fullName ,
                        username: profile?.username,
                        email: profile?.email,
                        phoneNumbe: profile?.phoneNumbe,
                        profession: profile?.profession,
                        birtDate: profile?.birtDate,
                        nasionality: profile?.nasionality,
                        gender: profile?.gender,
                    }}
                        onSubmit={editProfile}
                        enableReinitialize>
                    {({values,
                        handleChange,
                        handleBlur,
                        handleSubmit
                        }) =>(
                        <form onSubmit={handleSubmit} className="flex flex-col-reverse md:flex-row inline-block w-full bg-white p-[20px] md:px-[100px] md:py-[70px] rounded-2xl">
                            <div id="leftside" className="flex flex-col md:gap-3 flex-1 ">
                                <div className="mb-[50px] font-bold text-[20px] text-secondary">Profile</div>
                                <div className="w-full text-center">
                                    <div className="md:hidden relative inline-block rounded-full border-[6px] cursor-pointer bg-gradient-to-br from-primary to-secondary hover:from-primary hover:to-accent w-[137px] h-[137px]">
                                        {profile?.picture && (<img className="absolute object-cover rounded-full h-full w-full p-[6px]" src={profile?.picture.startsWith('https')? profile?.picture : `http://localhost:8888/uploads/${profile?.picture}`} alt="change-photo" />)}
                                        <div className="absolute top-[50px] left-[50px] text-white"><i data-feather="camera"></i></div>
                                    </div>
                                </div>
                                <div className="my-[30px] md:my-0 flex flex-col md:flex-row gap-2 font-[400] text-[14px]">
                                    <div className="w-[153px] text-secondary flex items-center">Nama</div>
                                    <input 
                                        name="fullName" 
                                        type="text" 
                                        className="border-2 rounded-2xl h-12 text-left w-full px-[20px] py-[17px] text-[#777777] border-neutral " 
                                        value={values.fullName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}/>
                                </div>
                                <div className="my-[30px] md:my-0 block md:flex font-[400] text-[14px] font-[400] text-[14px]">
                                    <div className="flex w-[140px] text-secondary items-center">Username</div>
                                    <div className="flex gap-3">
                                        {!editUsername && <span className="flex flex-row h-12 items-center text-left  text-[#777777] border-neutral ">{profile?.username}</span>}
                                        {editUsername && <input name="username" 
                                            type="text" 
                                            className="border-2 rounded-2xl h-12 text-left w-full px-[20px] py-[17px] text-[#777777] border-neutral " 
                                            value={values.username}
                                            onChange={handleChange}
                                            onBlur={handleBlur}/>}
                                        {!editUsername && <button onClick={()=> setEditUsername(true)} className="text-accent">Edit</button>}
                                    </div>
                                </div>
                                <div className="my-[30px] md:my-0 block flex flex-col md:flex-row font-[400] text-[14px]">
                                    <div className="flex w-[140px] text-secondary items-center">Email</div>
                                    <div className="flex gap-3">
                                        {!editEmail && <span className="flex flex-row h-12 items-center text-left  text-[#777777] ">{profile?.email}</span>}
                                        {editEmail && <input 
                                            name="email" 
                                            type="email" 
                                            className="border-2 rounded-2xl h-12 text-left w-full px-[20px] py-[17px] text-[#777777] border-neutral " 
                                            value={values.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}/>}
                                        {!editEmail && <button onClick={()=> setEditEmail(true)} className="text-accent">Edit</button>}
                                    </div>
                                </div>
                                <div className="my-[30px] md:my-0 block flex flex-col md:flex-row font-[400] text-[14px]">
                                    <div className="flex w-[140px] text-secondary items-center">Phone Number</div>
                                    <div className="flex gap-3">
                                        {!editPhoneNumber && <span className="flex flex-row h-12 items-center text-left  text-[#777777] ">{profile?.phoneNumbe}</span>}
                                        {editPhoneNumber && <input 
                                            name="phoneNumbe" 
                                            type="text" 
                                            className="border-2 rounded-2xl h-12 text-left w-full px-[20px] py-[17px] text-[#777777] border-neutral " 
                                            value={values.phoneNumbe}
                                            onChange={handleChange}
                                             onBlur={handleBlur}/>}
                                        {!editPhoneNumber && <button onClick={()=> setEditPhoneNumber(true)} className="text-accent">Edit</button>}
                                    </div>
                                </div>
                                <div className="my-[30px] md:my-0 block flex flex-col md:flex-row font-[400] text-[14px]">
                                    <div className="flex w-[153px] text-secondary items-center">Gender</div>
                                    <div className="flex gap-10 h-12 text-left w-full md:px-[20px] py-[17px] text-[#777777] ">
                                        <div className="flex gap-1">
                                            <input 
                                                type="radio" 
                                                name="gender" 
                                                className="radio radio-primary w-4 h-4"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value="0"/>
                                                <span className="pl-[5px]">Male</span>
                                        </div>
                                        <div className="flex gap-1">
                                            <input 
                                                type="radio" 
                                                name="gender" 
                                                className="radio radio-primary w-4 h-4"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value="1"/>
                                                <span className="pl-[5px]">Famale</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="my-[30px] md:my-0 block md:flex items-center font-[400] text-[14px]">
                                    <div className="w-[153px] text-secondary">Profession</div>
                                    <select 
                                        name="profession" 
                                        className="flex border-2 rounded-2xl h-12 text-left w-full px-3 text-[#777777] border-neutral"
                                        onChange={handleChange}
                                        onBlur={handleBlur}>
                                        {/* <option className="hidden">Select profetion</option> */}
                                        <option>{profile?.profession}</option>
                                    </select>
                                </div>
                                <div className="my-[30px] md:my-3 block md:flex items-center font-[400] text-[14px]">
                                    <div className="w-[153px] text-secondary">Nationality</div>
                                    <select 
                                        name="nasionality" 
                                        className="flex border-2 rounded-2xl h-12 w-full px-3 text-[#777777] border-neutral "
                                        onChange={handleChange}
                                        onBlur={handleBlur}>
                                        {/* <option className="hidden">Select Nationality</option> */}
                                        <option>{profile?.nasionality}</option>
                                    </select>
                                </div>
                                <div className="my-[30px] md:my-0 block flex flex-col gap-3 md:flex-row font-[400] text-[14px]">
                                    <div className="flex w-[100px] text-secondary items-center">Birthday Date</div>
                                    <div className="flex gap-3">
                                        {!editBirthDate && <span className="flex flex-row gap-3 h-12 items-center text-left text-[#777777] ">{moment(profile?.birthDate).format('DD/MM/YYYY')}</span>}
                                        {editBirthDate && <input 
                                            type="date"
                                            name="birthDate"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.date}/>}
                                        {!editBirthDate && <button onClick={()=> setEditBirthDate(true)} className="text-yellow-600 px-[10px]">Edit</button>}
                                    </div>
                                </div>
                                <button className="h-[61px] w-full md:w-3/12 rounded-2xl md:my-[30px] btn btn-primary shadow-lg" type="input">Save</button>
                            </div>
            
                            <hr className="hidden md:block h-[314px] border-2 rounded-2xl mx-[50px]"/>
            
                            <div id="rightside" className="pt-16 text-center hidden md:block">
                                    <div className="relative inline-block rounded-full border-[6px] cursor-pointer bg-gradient-to-br from-yellow-500 to-blue-400 hover:from-yellow-500 hover:to-blue-800 truncate w-[137px] h-[137px]">
                                        {profile?.picture && (<img className="absolute object-cover rounded-full h-full w-full p-[6px]" src={profile?.picture.startsWith('https')? profile?.picture : `http://localhost:8888/uploads/${profile?.picture}`} alt={profile?.fullName} />)}
                                        <div className="absolute top-[50px] left-[50px] text-white  w-[137px] h-[137px]"><i data-feather="camera"></i></div>
                                        <label className="md:hidden absolute w-full h-full top-0 left-0 bg-neutral/[0.5]"><BsCameraFill className="absolute top-11 left-11 text-white" size={35}/>
                                            <input type="file" className="hidden"/>
                                        </label>
                                    </div>
                                    <label className="flex items-center mt-[50px] border-2 w-full h-[40px] rounded-2xl btn btn-outline btn-primary rounded-2xl" >
                                        <input 
                                            name="picture"
                                            type="file" 
                                            className="hidden"
                                            onChange={(e)=> setSelectedPicture(e.target.files[0])}
                                            />
                                        Choose Photo
                                    </label>
                                    <ul className="hidden md:block my-[25px] text-left">
                                        <li>Image size: max, 2 MB</li>
                                        <li>Image formats: .JPG, .JPEG, .PNG</li>
                                    </ul>
                            </div>
                        </form>
                    )}
                </Formik>
            </main>
            <footer className="h-[476px] px-[30px] md:px-[20%] w-full md:py-10 md:bg-[#F4F7FF]">
                <div className="md:flex md:justify-between">
                <div className="mb-10">
                <Link to="/">
                        <div className="flex items-center">
                            <SiArtixlinux size={50} className="text-primary filter blur-[2.8px] pr-1"/>
                            <div className="text-primary text-[24px] font-bold" >TIX</div><div className="text-accent text-[24px] font-bold" >Event</div>
                        </div>
                    </Link>
                    <div className="flex gap-2 py-3 text-[14px] font-[400]">Find events you love with our</div>
                    <div>
                        <ul className="flex gap-6">
                            <BsFacebook size={20}/>
                            <BsWhatsapp size={20}/>
                            <AiFillInstagram size={25}/>
                            <AiFillTwitterCircle size={25}/>
                        </ul>
                    </div>
                    
                </div>
                <div>
                    <ul className="pb-[10px] ">
                        <li className="text-primary font-bold pb-[10px]">Wetick</li>
                        <li className="text-neutral pb-[10px]">About Us</li>
                        <li className="text-neutral pb-[10px]">Features</li>
                        <li className="text-neutral pb-[10px]">Blog</li>
                        <li className="text-neutral pb-[10px]">Payments</li>
                        <li className="text-neutral pb-[10px]">Mobile App</li>
                    </ul>
                </div>
                <div>
                    <ul className="pb-[10px] ">
                        <li className="text-primary font-bold pb-[10px]">Features</li>
                        <li className="text-neutral pb-[10px]">Booking</li>
                        <li className="text-neutral pb-[10px]">Create Event</li>
                        <li className="text-neutral pb-[10px]">Discover</li>
                        <li className="text-neutral pb-[10px]">Register</li>
                    </ul>
                </div>
                <div>
                    <ul className="pb-[10px] ">
                        <li className="text-primary font-bold pb-[10px]">Company</li>
                        <li className="text-neutral pb-[10px]">Partnership</li>
                        <li className="text-neutral pb-[10px]">Help</li>
                        <li className="text-neutral pb-[10px]">Terms of Service</li>
                        <li className="text-neutral pb-[10px]">Privacy Policy</li>
                        <li className="text-neutral pb-[10px]">Sitemap</li>
                    </ul>
                </div>
                </div>
                <p className="flex pt-[130px] text-neutral ">© 2020 Wetick All Rights Reserved</p>
            </footer>
        </div>
    )
}

export default Profile;