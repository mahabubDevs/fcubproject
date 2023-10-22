import React, { useEffect } from 'react'
import { Button } from '@mui/material';
import { getAuth } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { useSelector } from 'react-redux';
import Friendrequests from '../../components/friendrequests/Friendrequests';
import Friends from '../../components/friends/Friends';
import Blocklist from '../../components/blocklist/Blocklist';
import Peoples from '../../components/people/People';
import './people.css'


const People = () => {
    return (
        <div className="container frnds">
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Friendrequests />
                    <Friends />
                </Grid>
                <Grid item xs={6}>
                    < Peoples />
                    <Blocklist />
                </Grid>
            </Grid>
        </div>
    )
}

export default People