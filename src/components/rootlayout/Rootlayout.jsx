import { Grid } from '@mui/material'
import React, { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import './rootlayout.css'
import { AiFillHome, AiOutlineUser } from 'react-icons/ai';
import { PiPencilLineBold } from 'react-icons/pi';
import { HiUserGroup } from 'react-icons/hi';
import { BsFillChatFill } from 'react-icons/bs';
import { CgMenuRound } from 'react-icons/cg';
import { MdPowerSettingsNew } from 'react-icons/md';
import { FiSettings } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { userdata } from '../../features/userSlice';
import { getAuth, signOut } from "firebase/auth";
import { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs'
import { ClickAwayListener } from '@mui/base/ClickAwayListener';

import { MuiTelInput } from 'mui-tel-input'

import { getDatabase, ref, onValue, set } from "firebase/database";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    p: 4,
};

const Rootlayout = () => {
    const db = getDatabase();
    const auth = getAuth();
    let dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate();
    let userData = useSelector((state) => state.loginUser.loginUser)
    let [menu, setMenu] = useState(false)
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const [currentUser, setCurrentUser] = useState([]);
    let [username, setusername] = useState('');
    let [address, setaddress] = useState('');
    let [dateofbirth, setdateofbirth] = useState('');
    let [info, setinfo] = useState('');
    let [phonenumber, setphonenumber] = useState('');
    let [email, setemail] = useState('');
    let [about, setabout] = useState('');

    useEffect(() => {
        if (userData == null) {
            navigate("/login")
        }
    }, [])

    if (userData == null) {
        return
    }

    let handleLogOut = () => {
        signOut(auth).then(() => {
            localStorage.removeItem("LinkedInUser")
            localStorage.removeItem("activeChat")
            dispatch(userdata(null))
            navigate("/login");
        });
    }



    const handleOpen = () => {
        setMenu(false)
        setusername(currentUser.username);
        setaddress(currentUser.address);
        setdateofbirth(currentUser.dateofbirth);
        setinfo(currentUser.info);
        setphonenumber(currentUser.phonenumber);
        setemail(currentUser.email);
        setabout(currentUser.about);
        setOpen(true)
    };


    let handleeditbuttonsave = () => {
        set(ref(db, 'people/' + userData.uid), {
            ...currentUser,
            username: username,
            email: email,
            dateofbirth: dateofbirth,
            phonenumber: phonenumber,
            address: address,
            info: info,
            about: about,
        });
        setOpen(false)
    }

    useEffect(() => {
        onValue(ref(db, 'people/' + userData.uid), (snapshot) => {
            setCurrentUser(snapshot.val())
        });
    }, [])

    let handleinput = (e) => {
        var newDate = new Date(e.toJSON());
        var day = newDate.getDate();
        var month = newDate.getUTCMonth() + 1;
        var year = newDate.getFullYear();
        setdateofbirth(year + "-" + ("0" + (month)) + "-" + newDate.getDate());
    }


    const handlePhoneChange = (newValue) => {
        setphonenumber(newValue)
    }


    return (
        <>
            <Grid container>
                <div className='navcontainer'>
                    <div className="navbarbox">
                        <div className="navleft">
                            <Link to='/LinkedIn/home'>
                                <img src="/logo.png" alt="" />
                            </Link>
                        </div>
                        <div className="navright">

                            <ClickAwayListener onClickAway={() => setMenu(false)}>
                                <Box>
                                    <img onClick={() => setMenu(!menu)} src={userData.photoURL} alt="" />
                                    {
                                        menu &&
                                        <div className='navbar'>
                                            <div className="user">
                                                <div className="left">
                                                    <Link to='/LinkedIn/home'>
                                                        <img src={userData.photoURL} alt="" onClick={() => setMenu(!menu)} />
                                                    </Link>
                                                    <div className="text">
                                                        <h4>{userData.displayName}</h4>
                                                        <p onClick={handleOpen}>Edit Profile</p>
                                                    </div>
                                                </div>
                                                <div className="right">
                                                    <FiSettings className='settings' />
                                                    <MdPowerSettingsNew onClick={handleLogOut} className='logout' />
                                                </div>
                                            </div>
                                            <ul>
                                                <li >
                                                    <Link to='/LinkedIn/home' className={location.pathname == "/LinkedIn/home" ? 'active' : 'icon'} onClick={() => setMenu(!menu)}>
                                                        <AiFillHome /> Home
                                                    </Link>
                                                </li>
                                                <li >
                                                    <Link to='/LinkedIn/friends' className={location.pathname == "/LinkedIn/friends" ? 'active' : 'icon'} onClick={() => setMenu(!menu)}>
                                                        <AiOutlineUser /> Friends
                                                    </Link>
                                                </li>
                                                <li >
                                                    <Link to='/LinkedIn/posts' className={location.pathname == "/LinkedIn/posts" ? 'active' : 'icon'} onClick={() => setMenu(!menu)}>
                                                        <PiPencilLineBold /> Post
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    }
                                </Box>
                            </ClickAwayListener>


                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={style} component="form"

                                    noValidate
                                    autoComplete="off">
                                    <Typography id="modal-modal-title" variant="h6" component="h2">
                                        Edit Profile
                                    </Typography>
                                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                        <TextField id="outlined-controlled" label="Name" sx={{ width: 250 }} value={username} onChange={(e) => { setusername(e.target.value); }} />
                                        <TextField id="outlined-basic" label="Address" variant="outlined" sx={{ ml: 5, width: 350 }} value={address} onChange={(e) => { setaddress(e.target.value) }} />
                                    </Typography>
                                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                        <MuiTelInput label="Phone Number" variant="outlined" sx={{ width: 300 }} value={phonenumber} onChange={handlePhoneChange} />
                                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                                            <DatePicker
                                                label="Date of Birth"
                                                value={dayjs(dateofbirth)}
                                                onChange={handleinput}
                                                sx={{ ml: 5, width: 300 }}
                                            />
                                        </LocalizationProvider>
                                    </Typography>
                                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>

                                        <TextField id="outlined-basic" label="Email" variant="outlined" sx={{ width: 300 }} value={email} onChange={(e) => setemail(e.target.value)} />
                                    </Typography>
                                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                        <TextField id="outlined-multiline-flexible" label="Info" variant="outlined" multiline
                                            maxRows={6} sx={{ width: 640 }} value={info} onChange={(e) => setinfo(e.target.value)} />
                                    </Typography>
                                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                        <TextField
                                            id="outlined-multiline-flexible"
                                            label="About"
                                            multiline
                                            maxRows={6}
                                            sx={{ width: 640 }}
                                            onChange={(e) => setabout(e.target.value)}
                                            value={about}
                                        />
                                    </Typography>
                                    <Button variant="contained" href="#contained-buttons" size="small" sx={{ mt: 2 }} onClick={handleeditbuttonsave}>
                                        Save
                                    </Button>

                                </Box>
                            </Modal>
                        </div>
                    </div>
                </div>
            </Grid>
            <Outlet />
        </>
    )
}

export default Rootlayout