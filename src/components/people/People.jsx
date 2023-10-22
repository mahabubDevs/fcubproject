import React, { useEffect, useState } from 'react'
import '../commoncomponents.css'
import { TextField } from '@mui/material'
import { BsSearch, BsThreeDotsVertical } from 'react-icons/bs';
import { getDatabase, ref, onValue, set, remove } from "firebase/database";
import { useSelector } from 'react-redux';
import './people.css'

const People = () => {
    const db = getDatabase();
    let [peopleList, setPeopleList] = useState([])
    let userData = useSelector((state) => state.loginUser.loginUser)
    let [friendRequest, setFriendRequest] = useState([]);
    let [friends, setFriends] = useState([]);
    let [blocklist, setBlocklist] = useState([])

    useEffect(() => {
        const usersRef = ref(db, 'friends/');
        onValue(usersRef, (snapshot) => {
            let arr = []
            snapshot.forEach(item => {

                if (userData.uid == item.val().receiverid || userData.uid == item.val().senderid) {
                    arr.push(item.val().senderid + item.val().receiverid)
                }
            })
            setFriends(arr)
        });
    }, [])

    useEffect(() => {
        onValue(ref(db, 'people/'), (snapshot) => {
            let arr = []
            snapshot.forEach(item => {
                if (userData.uid != item.key) {
                    arr.push({
                        ...item.val(),
                        id: item.key,
                    })
                }
            })
            setPeopleList(arr)
        });
    }, [])


    let handleFriendRequest = (item) => {
        set(ref(db, 'friendrequest/' + (userData.uid + item.id)), {
            sendername: userData.displayName,
            senderid: userData.uid,
            receivername: item.username,
            receiverid: item.id,
            senderprofilepicture: userData.photoURL,
            receiverprofilepicture: item.profile_picture,
        });
    }


    useEffect(() => {
        const usersRef = ref(db, 'friendrequest/');
        onValue(usersRef, (snapshot) => {
            let arr = []
            snapshot.forEach(item => {
                arr.push(item.val().senderid + item.val().receiverid)
            })
            setFriendRequest(arr)
        });
    }, [])

    let handleFriendRequestCancel = (item) => {
        remove(ref(db, 'friendrequest/' + (item)));
    }


    useEffect(() => {
        const usersRef = ref(db, 'block/');
        onValue(usersRef, (snapshot) => {
            let arr = []
            snapshot.forEach(item => {
                arr.push(item.val().blockreceiverid + item.val().blocksenderid)
            })
            setBlocklist(arr)
        });
    }, [])



    return (
        <div className="box">
            <div className="title">
                <h3>People</h3>
                <BsThreeDotsVertical />
            </div>
            <div className="search">
                <BsSearch className='sb' />
                <input className="text" type="text" placeholder='Search' />
            </div>
            <div className="list">
                <ul>
                    {peopleList.map((item) => (
                        <li key={item.id}>
                            <div className="left">
                                <img src={item.profile_picture} alt="" />
                                <div className="text">
                                    <h4>{item.username}</h4>
                                    <p>{item.email}</p>
                                </div>
                            </div>
                            <div className="right button_section">
                                {blocklist.includes(userData.uid + item.id) ? <div className="btn">Block</div> :
                                    blocklist.includes(item.id + userData.uid) ? <div className="btn">Blocked</div>
                                        :
                                        friends.includes(userData.uid + item.id) || friends.includes(item.id + userData.uid) ?
                                            <div className="btn">Friends</div>
                                            : friendRequest.includes(userData.uid + item.id) ?
                                                <div onClick={() => handleFriendRequestCancel(userData.uid + item.id)} className="btn">Cancel</div>
                                                : friendRequest.includes(item.id + userData.uid) ?
                                                    <div onClick={() => handleFriendRequestCancel(item.id + userData.uid)} className="btn">Reject</div>
                                                    :
                                                    <div onClick={() => handleFriendRequest(item)} className="btn">Add</div>
                                }
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default People