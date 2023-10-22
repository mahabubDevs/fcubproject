import React, { useEffect, useState } from 'react'
import './posts.css'
import FormControl, { useFormControl } from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import { TextField } from '@mui/material';
import { BsImage, BsFillSendFill } from 'react-icons/bs';
import { getDatabase, ref, set, push, onValue, remove } from "firebase/database";
import { useSelector } from 'react-redux';
import { BiSolidEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import moment from 'moment';
import { RiDeleteBin6Line } from "react-icons/ri";
import { getStorage, ref as fireRef, uploadString, uploadBytesResumable, getDownloadURL } from "firebase/storage";


const styleEdit = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    p: 4,
};

const Posts = () => {
    const db = getDatabase();
    const storage = getStorage();
    let userData = useSelector((state) => state.loginUser.loginUser)
    let [postChange, setPostChange] = useState('')
    let [allPost, setAllPost] = useState([])
    let [friends, setFriends] = useState([]);

    let [editPost, setEditPost] = useState("")
    let [postImage, setPostImage] = useState("")
    let [newPostImage, setNewPostImage] = useState("")
    const [currentUser, setCurrentUser] = useState([]);
    const [updatePost, setUpdatePost] = useState([]);
    const [controlimg, setcontrolimg] = useState(true);

    let handlePost = () => {
        if (postChange != "" && postImage != "") {
            uploadString(fireRef(storage, 'postimages/' + 'userid:' + userData.uid + ' ' + moment().format('MMMM Do YYYY, h:mm:ss a')), postImage, 'data_url').then((snapshot) => {
                // console.log('Uploaded a data_url string!');
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                    // console.log('File available at', downloadURL);
                    set(push(ref(db, 'posts/')), {
                        whopost: userData.uid,
                        whopostimg: userData.photoURL,
                        whopostname: userData.displayName,
                        posts: postChange,
                        picture: downloadURL,
                        date: "Posted on " + moment().format('lll'),
                    }).then(() => {
                        setPostImage("")
                        setPostChange("")
                    });
                });
            });

        }
        else if (postChange != "") {
            set(push(ref(db, 'posts/')), {
                whopost: userData.uid,
                whopostimg: userData.photoURL,
                whopostname: userData.displayName,
                posts: postChange,
                picture: "",
                date: "Posted on " + moment().format('lll'),
            }).then(() => {
                setPostImage("")
                setPostChange("")
            });

        } else if (postImage != "") {
            uploadString(fireRef(storage, 'postimages/' + 'userid:' + userData.uid + ' ' + moment().format('MMMM Do YYYY, h:mm:ss a')), postImage, 'data_url').then((snapshot) => {
                // console.log('Uploaded a data_url string!');
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                    // console.log('File available at', downloadURL);
                    set(push(ref(db, 'posts/')), {
                        whopost: userData.uid,
                        whopostimg: userData.photoURL,
                        whopostname: userData.displayName,
                        posts: postChange,
                        picture: downloadURL,
                        date: "Posted on " + moment().format('lll'),
                    }).then(() => {
                        setPostImage("")
                        setPostChange("")
                    });
                });
            });

        }

    }

    useEffect(() => {
        const usersRef = ref(db, 'friends/');
        onValue(usersRef, (snapshot) => {
            let arr = []
            snapshot.forEach(item => {
                if (userData.uid == item.val().senderid) {
                    arr.push(item.val().receiverid)
                }
                else if (userData.uid == item.val().receiverid) {
                    arr.push(item.val().senderid)
                }
            })
            setFriends(arr)
        });
    }, [])


    useEffect(() => {
        const postsRef = ref(db, 'posts/');
        onValue(postsRef, (snapshot) => {
            let arr = []
            snapshot.forEach(item => {
                arr.push({
                    ...item.val(),
                    id: item.key,
                })
            })
            setAllPost(arr.reverse())
        });
    }, [])


    const [openEdit, setopenEdit] = useState(false);
    const handleopenEdit = (item) => {
        setUpdatePost(item)
        console.log("button", item);
        setNewPostImage(item.picture)
        setcontrolimg(false);
        setPostImage(item.picture);
        setEditPost(item.posts);
        setopenEdit(true)
    };
    const handleCloseEdit = () => {
        // 
        setcontrolimg(true);
        setEditPost("");
        setPostImage('');
        setopenEdit(false)
    };

    // console.log('check', controlimg);

    let handleEdit = (item) => {
        if (editPost != "" && postImage != newPostImage) {
            console.log("true");
            uploadString(fireRef(storage, 'postimages/' + 'userid:' + userData.uid + ' ' + moment().format('MMMM Do YYYY, h:mm:ss a')), postImage, 'data_url').then((snapshot) => {
                // console.log('Uploaded a data_url string!');
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                    // console.log('File available at', downloadURL);
                    set(ref(db, 'posts/' + item.id), {
                        ...item,
                        posts: editPost,
                        picture: downloadURL,
                        date: "Updated on " + moment().format('lll'),
                    }).then(() => {
                        setEditPost("");
                        setPostImage("")
                        setopenEdit(false)
                        setcontrolimg(true);
                    });
                });
            });

        } else if (editPost != "" && postImage == newPostImage) {

            set(ref(db, 'posts/' + item.id), {
                ...item,
                posts: editPost,
                date: "Updated on " + moment().format('lll'),
            }).then(() => {
                setEditPost("");
                setPostImage("")
                setopenEdit(false)
                setcontrolimg(true);
            });

        }

    }

    useEffect(() => {
        onValue(ref(db, 'people/' + userData.uid), (snapshot) => {
            setCurrentUser(snapshot.val())
        });
    }, [])



    let handlePostRemove = (item) => {
        remove(ref(db, 'posts/' + item.id));
    }

    let deletepostimg = (item) => {
        setPostImage("")
    }


    const onPostPicChange = (e) => {
        setPostImage(URL.createObjectURL(e.target.files[0]));
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setPostImage(reader.result);
        };
        reader.readAsDataURL(files[0]);
    };

    return (
        <div className="container">
            <div className="scrollcontainer">
                <div className="newpost">
                    <div className="title">NEW POST</div>
                    <div className="textfield">
                        <TextField
                            id="outlined-multiline-flexible"
                            multiline
                            maxRows={4}
                            sx={{ width: "79%" }}
                            placeholder="What’s on your mind?"
                            onChange={(e) => setPostChange(e.target.value)}
                            value={postChange}
                        />
                        <label htmlFor="postimginput">
                            <BsImage className='icon' />
                        </label>
                        <input type="file" accept="image/png, image/gif, image/jpeg" id='postimginput' onChange={onPostPicChange} />
                        <BsFillSendFill className='icon' onClick={handlePost} />
                    </div>
                    {(postImage && controlimg) &&
                        <div className="showimgbox">
                            <img src={postImage} className='showimg'></img>
                            <div className="showoffbtn">
                                <Button variant="outlined" className='showicon' startIcon={<RiDeleteBin6Line />} onClick={deletepostimg}>
                                    Delete
                                </Button>
                            </div>
                        </div>
                    }
                </div>

                <section className='allpost'>
                    {allPost.map((item) => (
                        (userData.uid == item.whopost) ?
                            <div className="post" key={item.id}>
                                <div className="profile">
                                    <div className="left">
                                        <div className="proimg">
                                            <img src={item.whopostimg} alt="" />
                                        </div>
                                        <div className="proinfo">
                                            <div className="name">{item.whopostname}</div>
                                            <div className="profession">Student</div>

                                        </div>
                                    </div>
                                    {
                                        userData.uid == item.whopost && <div className="right">
                                            <div className="date">{item.date}</div>
                                            <BiSolidEdit className='icon' onClick={() => handleopenEdit(item)} />
                                            <Modal
                                                open={openEdit}
                                                onClose={handleCloseEdit}
                                                aria-labelledby="modal-modal-title"
                                                aria-describedby="modal-modal-description"
                                            >
                                                <Box sx={styleEdit}>
                                                    <Typography id="modal-modal-title" variant="h6" component="h2">
                                                        Edit Post
                                                    </Typography>

                                                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                                        <TextField
                                                            id="outlined-multiline-flexible"
                                                            label="What's on your mind?"
                                                            multiline
                                                            maxRows={4}
                                                            sx={{ width: 700 }}
                                                            onChange={(e) => setEditPost(e.target.value)}
                                                            value={editPost}
                                                        />
                                                    </Typography>

                                                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                                        <input type="file" accept="image/png, image/gif, image/jpeg" id='postimginput' onChange={onPostPicChange} />
                                                    </Typography>

                                                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                                        <div className="postimg">
                                                            <img src={postImage} alt="" width="300" />
                                                        </div>
                                                    </Typography>
                                                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                                        <Button variant="contained" href="#contained-buttons" size="small" sx={{ mt: 2 }} onClick={() => handleEdit(updatePost)}>
                                                            Update
                                                        </Button>
                                                    </Typography>

                                                </Box>
                                            </Modal>

                                            <MdDelete className='icon' onClick={() => handlePostRemove(item)} />
                                        </div>
                                    }
                                </div>
                                <div className="text">{item.posts}</div>
                                <div className="postimg">
                                    <img src={item.picture} alt="" />
                                </div>
                            </div>
                            :
                            friends.map((frnditem) => (
                                (frnditem == item.whopost) &&
                                <div className="post" key={frnditem.key}>
                                    <div className="profile">
                                        <div className="left">
                                            <div className="proimg">
                                                <img src={item.whopostimg} alt="" />
                                            </div>
                                            <div className="proinfo">
                                                <div className="name">{item.whopostname}</div>
                                                <div className="profession">Student</div>

                                            </div>
                                        </div>
                                        <div className="right">
                                            <div className="date">{item.date}</div>
                                        </div>

                                    </div>
                                    <div className="text">{item.posts}</div>
                                    <div className="postimg">
                                        <img src={item.picture} alt="" />
                                    </div>
                                </div>

                            ))

                    ))}
                </section>

                <div className="myprofile">
                    <div className="myprofilecover">
                        <img src="/cover.png" alt="" />
                    </div>
                    <div className="myprofileinfo">
                        <div className="myprofileimg">
                            <img src={userData.photoURL} alt="" />
                        </div>
                        <div className="info">
                            <h2>{userData.displayName}</h2>
                            <div className="details">
                                {currentUser.info}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>



    )
}

export default Posts