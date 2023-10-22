import React, { useEffect, useState } from 'react'
import '../commoncomponents.css'
import { TextField } from '@mui/material'
import { BsSearch, BsThreeDotsVertical } from 'react-icons/bs';
import './friendrequests.css'
import { getDatabase, ref, onValue, set, remove } from "firebase/database";
import { useSelector } from 'react-redux';

const Friendrequests = () => {
    const db = getDatabase();
    let [friendRequest, setFriendRequest] = useState([]);
    let userData = useSelector((state) => state.loginUser.loginUser)

    useEffect(() => {
        const usersRef = ref(db, 'friendrequest/');
        onValue(usersRef, (snapshot) => {
            let arr = []
            snapshot.forEach(item => {

                if (userData.uid == item.val().receiverid) {
                    arr.push({
                        ...item.val(),
                        id: item.key,
                    })
                }
            })
            setFriendRequest(arr)
        });
    }, [])

    let handleFriendRequestConfirm = (item) => {
        console.log(item);
        set(ref(db, 'friends/' + (item.id)), {
            ...item
        }).then(() => {
            remove(ref(db, 'friendrequest/' + (item.id)));
        });
    }


    let handleFriendRequestCancel = (item) => {
        remove(ref(db, 'friendrequest/' + (item.id)));
    }

    return (
        <div className="box">
            <div className="title">
                <h3>Friend Requests</h3>
                <BsThreeDotsVertical />
            </div>
            <div className="list">
                {friendRequest.length
                    ? <ul>
                        {friendRequest.map((item) => (
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
                                        <h4>{item.sendername}</h4>
                                        <p>Love You.....</p>
                                    </div>
                                </div>
                                <div className="right button_section_req">
                                    <div onClick={() => handleFriendRequestConfirm(item)} className="btn confirm">Confirm</div>
                                    <div onClick={() => handleFriendRequestCancel(item)} className="btn cancel">Cancel</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    : <p>No Friend Request</p>
                }
            </div>
        </div>
    )
}

export default Friendrequests