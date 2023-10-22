import React, { useEffect, useState } from 'react'
import '../commoncomponents.css'
import { TextField } from '@mui/material'
import { BsSearch, BsThreeDotsVertical } from 'react-icons/bs';
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { useSelector } from 'react-redux';

const Blocklist = () => {
    const db = getDatabase();

    let userData = useSelector((state) => state.loginUser.loginUser)

    let [blocklist, setBlocklist] = useState([])

    useEffect(() => {
        const blockRef = ref(db, 'block/');
        onValue(blockRef, (snapshot) => {
            let arr = []
            snapshot.forEach((item) => {
                if (item.val().blocksenderid == userData.uid || item.val().blocksenderid == userData.uid) {
                    arr.push({
                        ...item.val(), id: item.key
                    })
                }
            })
            setBlocklist(arr)
        });
    }, [])


    let handleUnblock = (item) => {
        remove(ref(db, "block/" + item.id));
    }



    return (
        <div className="box">
            <div className="title">
                <h3>Block List</h3>
                <BsThreeDotsVertical />
            </div>
            <div className="list">
                {blocklist.length
                    ? <ul>
                        {blocklist.map((item) => (
                            <li key={item.id}>
                                <div className="left">
                                    <img src={item.blockreceiverprofilepicture} alt="" />
                                    <div className="text">
                                        <h4>{item.blockreceivername}</h4>
                                        <p>Love You.....</p>
                                    </div>
                                </div>
                                <div className="right button_section">
                                    <div onClick={() => handleUnblock(item)} className="btn">Unblock</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    : <p>Empty Block List</p>
                }

            </div>
        </div>
    )
}

export default Blocklist