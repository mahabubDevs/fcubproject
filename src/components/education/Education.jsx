import React, { useEffect, useState } from 'react'
import './education.css'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { BiSolidEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs'
import { getDatabase, ref, set, push, onValue, remove } from "firebase/database";
import { useSelector } from 'react-redux';



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




const Education = () => {
    const db = getDatabase();
    let userData = useSelector((state) => state.loginUser.loginUser)
    const [openAdd, setopenAdd] = useState(false);
    const handleopenAdd = () => setopenAdd(true);
    const handleCloseAdd = () => {
        setopenAdd(false)
    };

    let [institution, setInstitution] = useState('');
    let [eduDegree, setEduDegree] = useState('');
    let [eduInstitutionJoinDate, setEduInstitutionJoinDate] = useState('');
    let [eduInstitutionEndDate, setEduInstitutionEndDate] = useState('');
    let [eduDetails, setEduDetails] = useState('');
    let [edu, setEdu] = useState([]);
    let [eduId, setEduId] = useState('');


    const [openEdit, setopenEdit] = useState(false);
    const handleopenEdit = (item) => {
        setEduId(item.id)
        setInstitution(item.institution);
        setEduDegree(item.eduDegree);
        setEduInstitutionJoinDate(item.eduInstitutionJoinDate);
        setEduInstitutionEndDate(item.eduInstitutionEndDate);
        setEduDetails(item.eduDetails);
        setopenEdit(true)
    };
    const handleCloseEdit = () => {
        setInstitution('');
        setEduDegree('');
        setEduInstitutionJoinDate('');
        setEduInstitutionEndDate('');
        setEduDetails('');
        setopenEdit(false)
    };



    let handleinputeduInstutionJoinDate = (e) => {
        var newDate = new Date(e.toJSON());
        var day = newDate.getDate();
        var month = newDate.getUTCMonth() + 1;
        var year = newDate.getFullYear();
        setEduInstitutionJoinDate(year + "-" + ("0" + (month)) + "-" + newDate.getDate());
    }

    let handleinputeduInstutionEndDate = (e) => {
        var newDate = new Date(e.toJSON());
        var day = newDate.getDate();
        var month = newDate.getUTCMonth() + 1;
        var year = newDate.getFullYear();
        setEduInstitutionEndDate(year + "-" + ("0" + (month)) + "-" + newDate.getDate());
    }

    let handleEduSave = () => {
        set(push(ref(db, 'educations/')), {
            userid: userData.uid,
            institution: institution,
            eduDegree: eduDegree,
            eduInstitutionJoinDate: eduInstitutionJoinDate,
            eduInstitutionEndDate: eduInstitutionEndDate,
            eduDetails: eduDetails,
        }).then(() => {
            setInstitution('');
            setEduDegree('');
            setEduInstitutionJoinDate('');
            setEduInstitutionEndDate('');
            setEduDetails('');
            setopenAdd(false)
        });
    }
    let handleEduEdit = (item) => {
        set(ref(db, 'educations/' + eduId), {
            userid: userData.uid,
            institution: institution,
            eduDegree: eduDegree,
            eduInstitutionJoinDate: eduInstitutionJoinDate,
            eduInstitutionEndDate: eduInstitutionEndDate,
            eduDetails: eduDetails,
        }).then(() => {
            setInstitution('');
            setEduDegree('');
            setEduInstitutionJoinDate('');
            setEduInstitutionEndDate('');
            setEduDetails('');
            setopenEdit(false)
        });
    }


    useEffect(() => {
        onValue(ref(db, 'educations/'), (snapshot) => {
            let arr = []
            snapshot.forEach(item => {
                if (userData.uid == item.val().userid) {
                    arr.push({
                        ...item.val(),
                        id: item.key,
                    })
                }
            })
            setEdu(arr.reverse())
        });
    }, [])

    let handleeduremove = (item) => {
        remove(ref(db, 'educations/' + item.id));
    }

    return (
        <div className="education">
            <div className="barbox">
                <h4>Education</h4>
                <div className="edubtn" onClick={handleopenAdd}>Add Education</div>

                <Modal
                    open={openAdd}
                    onClose={handleCloseAdd}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={styleAdd}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Add Education
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            <TextField id="outlined-controlled" label="Institution" sx={{ width: 700 }}
                                onChange={(e) => setInstitution(e.target.value)}
                                value={institution}
                            />
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            <TextField
                                id="outlined-multiline-flexible"
                                label="Degree"
                                multiline
                                maxRows={2}
                                sx={{ width: 700 }}
                                onChange={(e) => setEduDegree(e.target.value)}
                                value={eduDegree}
                            />
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Joining date"
                                    sx={{ width: 250 }}
                                    onChange={handleinputeduInstutionJoinDate}
                                    value={dayjs(eduInstitutionJoinDate)}
                                />
                                <DatePicker
                                    label="Ending date"
                                    sx={{ ml: 5, width: 250 }}
                                    onChange={handleinputeduInstutionEndDate}
                                    value={dayjs(eduInstitutionEndDate)}
                                />
                            </LocalizationProvider>
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            <TextField
                                id="outlined-multiline-flexible"
                                label="Details"
                                multiline
                                maxRows={4}
                                sx={{ width: 700 }}
                                onChange={(e) => setEduDetails(e.target.value)}
                                value={eduDetails}
                            />
                        </Typography>
                        <Button variant="contained" href="#contained-buttons" size="small" sx={{ mt: 2 }} onClick={handleEduSave}>
                            Save
                        </Button>
                    </Box>
                </Modal>


            </div>
            {
                edu.map((item) => (
                    <div className="edufield" key={item.id}>
                        <div className="edulogo">
                            <img src="/ext.png" alt="" />
                        </div>
                        <div className="eduinfo">
                            <div className="titlebox">
                                <div className="title">{item.institution}</div>

                                <div className="edubtn">
                                    <BiSolidEdit className='eduicon' onClick={() => handleopenEdit(item)} />

                                    <Modal
                                        open={openEdit}
                                        onClose={handleCloseEdit}
                                        aria-labelledby="modal-modal-title"
                                        aria-describedby="modal-modal-description"
                                    >
                                        <Box sx={styleAdd}>
                                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                                Add Education
                                            </Typography>
                                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                                <TextField id="outlined-controlled" label="Institution" sx={{ width: 700 }}
                                                    onChange={(e) => setInstitution(e.target.value)}
                                                    value={institution}
                                                />
                                            </Typography>
                                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                                <TextField
                                                    id="outlined-multiline-flexible"
                                                    label="Degree"
                                                    multiline
                                                    maxRows={2}
                                                    sx={{ width: 700 }}
                                                    onChange={(e) => setEduDegree(e.target.value)}
                                                    value={eduDegree}
                                                />
                                            </Typography>
                                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePicker
                                                        label="Joining date"
                                                        sx={{ width: 250 }}
                                                        onChange={handleinputeduInstutionJoinDate}
                                                        value={dayjs(eduInstitutionJoinDate)}
                                                    />
                                                    <DatePicker
                                                        label="Ending date"
                                                        sx={{ ml: 5, width: 250 }}
                                                        onChange={handleinputeduInstutionEndDate}
                                                        value={dayjs(eduInstitutionEndDate)}
                                                    />
                                                </LocalizationProvider>
                                            </Typography>
                                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                                <TextField
                                                    id="outlined-multiline-flexible"
                                                    label="Details"
                                                    multiline
                                                    maxRows={4}
                                                    sx={{ width: 700 }}
                                                    onChange={(e) => setEduDetails(e.target.value)}
                                                    value={eduDetails}
                                                />
                                            </Typography>
                                            <Button variant="contained" href="#contained-buttons" size="small" sx={{ mt: 2 }} onClick={() => handleEduEdit(item)}>
                                                Update
                                            </Button>
                                        </Box>
                                    </Modal>

                                    <MdDelete className='eduicon' onClick={() => handleeduremove(item)} /></div>
                            </div>
                            <div className="degree">
                                {item.eduDegree}
                            </div>
                            <div className="year">{item.eduInstitutionJoinDate} — {item.eduInstitutionEndDate ? item.eduInstitutionEndDate : "Now"}</div>
                            <div className="courses">{item.eduDetails}</div>
                        </div>
                    </div>
                ))
            }

        </div>
    )
}

export default Education