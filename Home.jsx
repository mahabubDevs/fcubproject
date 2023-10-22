import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid';
import People from '../../components/people/People';
import Friendrequests from '../../components/friendrequests/Friendrequests';
import Friends from '../../components/friends/Friends';
import Blocklist from '../../components/blocklist/Blocklist';
import { Link, Outlet, useLocation } from 'react-router-dom'
import Button from '@mui/material/Button';
import './home.css'
import { FiEdit } from 'react-icons/fi';
import { FaLocationArrow } from 'react-icons/fa';
import { BiLogoLinkedinSquare } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs'
import { MuiTelInput } from 'mui-tel-input'
import { getDatabase, ref, onValue, set, push, remove } from "firebase/database";
import { BiSolidEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { differenceInDays } from 'date-fns'
import Education from '../../components/education/Education';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    p: 4,
};

const styleAdd = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    p: 4,
};

const styleEdit = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    p: 4,
};

const styleContact = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    p: 4,
};

const Home = () => {
    const db = getDatabase();
    let userData = useSelector((state) => state.loginUser.loginUser)
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


    const [openAdd, setopenAdd] = useState(false);
    const handleopenAdd = () => setopenAdd(true);
    const handleCloseAdd = () => {
        setExpDesignation('');
        setExpCompany('');
        setExpCompanyType('');
        setExpCompanyJoinDate('');
        setExpCompanyEndDate('');
        setExpDetails('');
        setopenAdd(false)
    };
    let [exp, setExp] = useState([]);
    let [expDesignation, setExpDesignation] = useState('');
    let [expCompany, setExpCompany] = useState('');
    let [expCompanyType, setExpCompanyType] = useState('');
    let [expCompanyJoinDate, setExpCompanyJoinDate] = useState('');
    let [expCompanyEndDate, setExpCompanyEndDate] = useState('');
    let [expDetails, setExpDetails] = useState('');
    let [expId, setExpId] = useState('');



    const [openContact, setopenContact] = useState(false);
    const handleopenContact = () => setopenContact(true);
    const handleCloseContact = () => setopenContact(false);


    const [openEdit, setOpenEdit] = useState(false);
    const handleOpenEdit = (item) => {
        setExpDesignation(item.expDesignation);
        setExpCompany(item.expCompany);
        setExpCompanyType(item.expCompanyType);
        setExpCompanyJoinDate(item.expCompanyJoinDate);
        setExpCompanyEndDate(item.expCompanyEndDate);
        setExpDetails(item.expDetails);
        setExpId(item.id);
        setOpenEdit(true)
    };

    const handleCloseEdit = () => {
        setExpDesignation('');
        setExpCompany('');
        setExpCompanyType('');
        setExpCompanyJoinDate('');
        setExpCompanyEndDate('');
        setExpDetails('');
        setOpenEdit(false)
    };

    const handleOpen = () => {
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
        }).then(() => {
            setusername('');
            setaddress('');
            setdateofbirth('');
            setinfo('');
            setphonenumber('');
            setemail('');
            setabout('');
            setOpen(false)
        });
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


    let handleExpAdd = () => {
        set(push(ref(db, 'experiance/')), {
            userid: userData.uid,
            expDesignation: expDesignation,
            expCompany: expCompany,
            expCompanyType: expCompanyType,
            expCompanyJoinDate: expCompanyJoinDate,
            expCompanyEndDate: expCompanyEndDate,
            expDetails: expDetails,
        }).then(() => {
            setExpDesignation('');
            setExpCompany('');
            setExpCompanyType('');
            setExpCompanyJoinDate('');
            setExpCompanyEndDate('');
            setExpDetails('');
            setopenAdd(false)
        });;
    }


    let handleinputexpCompanyJoinDate = (e) => {
        var newDate = new Date(e.toJSON());
        var day = newDate.getDate();
        var month = newDate.getUTCMonth() + 1;
        var year = newDate.getFullYear();
        setExpCompanyJoinDate(year + "-" + ("0" + (month)) + "-" + newDate.getDate());
    }

    let handleinputexpCompanyEndDate = (e) => {
        var newDate = new Date(e.toJSON());
        var day = newDate.getDate();
        var month = newDate.getUTCMonth() + 1;
        var year = newDate.getFullYear();
        setExpCompanyEndDate(year + "-" + ("0" + (month)) + "-" + newDate.getDate());
    }

    let handleexpremove = (item) => {
        remove(ref(db, 'experiance/' + item.id));
    }

    let handleExpEdit = () => {
        set(ref(db, 'experiance/' + expId), {
            userid: userData.uid,
            expDesignation: expDesignation,
            expCompany: expCompany,
            expCompanyType: expCompanyType,
            expCompanyJoinDate: expCompanyJoinDate,
            expCompanyEndDate: expCompanyEndDate,
            expDetails: expDetails,
        }).then(() => {
            setExpDesignation('');
            setExpCompany('');
            setExpCompanyType('');
            setExpCompanyJoinDate('');
            setExpCompanyEndDate('');
            setExpDetails('');
            setOpenEdit(false)
        });;
    }


    useEffect(() => {
        onValue(ref(db, 'experiance/'), (snapshot) => {
            let arr = []
            snapshot.forEach(item => {
                if (userData.uid == item.val().userid) {
                    arr.push({
                        ...item.val(),
                        id: item.key,
                    })
                }
            })
            setExp(arr.reverse())
        });
    }, [])

    return (
        <div className="container">
            <div className="profile">
                <div className="coverphoto">
                    <img src="/cover.png" alt="" />
                    <Button className='editbtn' variant="outlined" size="small">
                        <FiEdit />
                        <span className='edittext' onClick={handleOpen}>Edit Profile</span>
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
                    </Button>
                </div>
                <div className="profileinfo">
                    <div className="propic">
                        <img src={userData.photoURL} alt="" />
                    </div>
                    <div className="info">
                        <div className="nameloc">
                            <h2>{userData.displayName}<BiLogoLinkedinSquare className='nameicon' /></h2>
                            <div className="loc"> <FaLocationArrow className='locicon' /> <span className='locedit'>{currentUser.address}</span></div>
                        </div>
                        <div className="details">
                            {currentUser.info}
                        </div>
                        <Button size="small" variant="contained" onClick={handleopenContact}>
                            Contact info
                        </Button>
                        <Modal
                            open={openContact}
                            onClose={handleCloseContact}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={styleContact}>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Contact info
                                </Typography>
                                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                    Name: {currentUser.username} <br />
                                    Date of birth: {currentUser.dateofbirth} <br />
                                    Phone number: {currentUser.phonenumber} <br />
                                    Email: {currentUser.email} <br />
                                    Address: {currentUser.address}

                                </Typography>
                            </Box>
                        </Modal>
                    </div>
                </div>
            </div>
            <div className="section">
                <Link to='/LinkedIn/home' className={location.pathname == "/LinkedIn/home" ? "profile active" : "profile"}>Profile</Link>
                <Link to='/LinkedIn/friends' className={location.pathname == "/LinkedIn/friends" ? "friends active" : "friends"}>Friends</Link>
                <Link to='/LinkedIn/posts' className={location.pathname == "/LinkedIn/posts" ? "post active" : "post"}>Post</Link>
            </div>
            <div className="about">
                <h4>About</h4>
                <p>{currentUser.about}</p>
                <Button size="small">
                    SEE MORE
                </Button>

            </div>
            <div className="projects">
                <h4>Projects <span className='projectcount'>3 of 12</span></h4>
                <div className="pic">
                    <img src="/ext.png" alt="" />
                    <img src="/ext.png" alt="" />
                    <img src="/ext.png" alt="" />
                </div>
            </div>
            <div className="experiance">
                <div className="barbox">
                    <h4>Experiance</h4>
                    <div className="expbtn" onClick={handleopenAdd}>Add Experiance</div>
                </div>
                {exp.map((item) => (
                    <div className="expfield" key={item.id}>
                        <div className="explogo">
                            <img src="/ext.png" alt="" />
                        </div>
                        <div className="expinfo">
                            <div className="exptitle">
                                <div className="exptitletext">{item.expDesignation} </div>
                                <div className="expbtn"><BiSolidEdit className='expicon' onClick={() => handleOpenEdit(item)} /> <MdDelete className='expicon' onClick={() => handleexpremove(item)} /></div>
                            </div>
                            <div className="expbox">
                                <div className="left">{item.expCompany}</div>
                                <div className="right">{item.expCompanyType}</div>
                            </div>
                            <div className="expbox">
                                <div className="left">{item.expCompanyJoinDate} to {item.expCompanyEndDate ? item.expCompanyEndDate : <>Now</>}</div>
                                <div className="right rightcolor">{item.range}</div>
                            </div>
                            <div className="expdetails">
                                {item.expDetails}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Education />

            <Modal
                open={openAdd}
                onClose={handleCloseAdd}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleAdd}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Add Experiance
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <TextField id="outlined-controlled" label="Designation" sx={{ width: 500 }} onChange={(e) => { setExpDesignation(e.target.value) }} value={expDesignation} />
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <TextField id="outlined-controlled" label="Company" sx={{ width: 350 }} onChange={(e) => { setExpCompany(e.target.value) }} value={expCompany} />
                        <TextField id="outlined-basic" label="Type" variant="outlined" sx={{ ml: 5, width: 250 }} onChange={(e) => { setExpCompanyType(e.target.value) }} value={expCompanyType} />
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Joining date"
                                sx={{ width: 250 }}
                                onChange={handleinputexpCompanyJoinDate}
                                value={dayjs(expCompanyJoinDate)}
                            />
                            <DatePicker
                                label="Ending date"
                                sx={{ ml: 5, width: 250 }}
                                onChange={handleinputexpCompanyEndDate}
                                value={dayjs(expCompanyEndDate)}
                            />
                        </LocalizationProvider>
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <TextField
                            id="outlined-multiline-flexible"
                            label="Details"
                            multiline
                            maxRows={4}
                            sx={{ width: 640 }}
                            onChange={(e) => setExpDetails(e.target.value)}
                            value={expDetails}
                        />
                    </Typography>
                    <Button variant="contained" href="#contained-buttons" size="small" sx={{ mt: 2 }} onClick={handleExpAdd}>
                        Save
                    </Button>
                </Box>
            </Modal>



            <Modal
                open={openEdit}
                onClose={handleCloseEdit}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={styleEdit}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Update Experiance
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <TextField id="outlined-controlled" label="Designation" sx={{ width: 500 }} onChange={(e) => { setExpDesignation(e.target.value) }} value={expDesignation} />
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <TextField id="outlined-controlled" label="Company" sx={{ width: 350 }} onChange={(e) => { setExpCompany(e.target.value) }} value={expCompany} />
                        <TextField id="outlined-basic" label="Type" variant="outlined" sx={{ ml: 5, width: 250 }} onChange={(e) => { setExpCompanyType(e.target.value) }} value={expCompanyType} />
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Joining date"
                                sx={{ width: 250 }}
                                onChange={handleinputexpCompanyJoinDate}
                                value={dayjs(expCompanyJoinDate)}
                            />
                            <DatePicker
                                label="Ending date"
                                sx={{ ml: 5, width: 250 }}
                                onChange={handleinputexpCompanyEndDate}
                                value={dayjs(expCompanyEndDate)}
                            />
                        </LocalizationProvider>
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <TextField
                            id="outlined-multiline-flexible"
                            label="Details"
                            multiline
                            maxRows={4}
                            sx={{ width: 640 }}
                            onChange={(e) => setExpDetails(e.target.value)}
                            value={expDetails}
                        />
                    </Typography>
                    <Button variant="contained" href="#contained-buttons" size="small" sx={{ mt: 2 }} onClick={handleExpEdit}>
                        Update
                    </Button>
                </Box>
            </Modal>
        </div>
    )
}

export default Home