import React, { useEffect, useState } from 'react'
import '../commoncomponents.css'
import { TextField } from '@mui/material'
import { BsSearch, BsThreeDotsVertical } from 'react-icons/bs';
import { getDatabase, ref, onValue, set, remove, push } from "firebase/database";
import { useSelector } from 'react-redux';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import Fade from '@mui/material/Fade';
import { Button } from '@mui/material'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';


const Friends = () => {
    const db = getDatabase();
    let [friends, setFriends] = useState([]);
    let userData = useSelector((state) => state.loginUser.loginUser)

    const [anchorEl, setanchorEl] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [placement, setPlacement] = React.useState();

    const handleClick = (newPlacement) => (event) => {
        setanchorEl(event.currentTarget);
        setOpen((prev) => placement !== newPlacement || !prev);
        setPlacement(newPlacement);
    };

    let handleBlock = (item) => {
        if (userData.uid == item.senderid) {
            set(push(ref(db, "block/")), {
                blockreceivername: item.receivername,
                blockreceiverid: item.receiverid,
                blocksendername: item.sendername,
                blocksenderid: item.senderid,
                blockreceiverprofilepicture: item.receiverprofilepicture,
            }).then(() => {
                remove(ref(db, "friends/" + item.id));
            })
        } else {
            set(push(ref(db, "block/")), {
                blockreceivername: item.sendername,
                blockreceiverid: item.senderid,
                blocksendername: item.receivername,
                blocksenderid: item.receiverid,
                blockreceiverprofilepicture: item.senderprofilepicture,
            }).then(() => {
                remove(ref(db, "friends/" + item.id));
            })
        }

    }

    let handleUnfriend = (item) => {
        remove(ref(db, "friends/" + item.id));
    }


    useEffect(() => {
        const usersRef = ref(db, 'friends/');
        onValue(usersRef, (snapshot) => {
            let arr = []
            snapshot.forEach(item => {

                if (userData.uid == item.val().receiverid || userData.uid == item.val().senderid) {
                    arr.push({
                        ...item.val(),
                        id: item.key,
                    })
                }
            })
            setFriends(arr)
        });
    }, [])

    return (
        <div className="box">
            <div className="title">
                <h3>Friends</h3>
                <BsThreeDotsVertical />
            </div>
            <div className="search">
                <BsSearch className='sb' />
                <input className="text" type="text" placeholder='Search' />
            </div>
            <div className="list">
                {friends.length
                    ? <ul>
                        {friends.map((item) => (
                            <li key={item.id}>
                                <div className="left">
                                    {
                                        item.receiverid == userData.uid
                                            ?
                                            <img src={item.senderprofilepicture} alt="" />
                                            :
                                            <img src={item.receiverprofilepicture} alt="" />
                                    }

                                    <div className="text">
                                        {
                                            item.receiverid == userData.uid
                                                ?
                                                <h4>{item.sendername}</h4>
                                                :
                                                <h4>{item.receivername}</h4>
                                        }
                                        <p>Love You.....</p>
                                    </div>
                                </div>
                                <div className="right">
                                    <BsThreeDotsVertical className='dot' onClick={handleClick('bottom-end')} />
                                    <Popper open={open} anchorEl={anchorEl} placement={placement} transition>
                                        {({ TransitionProps }) => (
                                            <Fade {...TransitionProps} timeout={350}>
                                                <Paper>
                                                    <Button onClick={() => handleUnfriend(item)} sx={{ pl: 4, pr: 4 }} className='btn' size="small">Unfriend</Button>
                                                    <br />
                                                    <Button onClick={() => handleBlock(item)} sx={{ pl: 4, pr: 4 }} className='btn' size="small">Block</Button>
                                                </Paper>
                                            </Fade>
                                        )}
                                    </Popper>
                                </div>
                            </li>
                        ))}
                    </ul>
                    : <p>No Friends</p>

                }

            </div>
        </div>
    )
}

export default Friends