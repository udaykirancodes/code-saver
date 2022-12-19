import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { myCodeUrl } from '../../url'
import { Link } from 'react-router-dom';

import { format } from 'timeago.js';

import axios from 'axios';
import { dangerToast, successToast } from '../../Components/Toast/Toast';


export default function Home() {
    const [search, setSearch] = useState('');
    const [liked, setLiked] = useState(false);
    const navigate = useNavigate();
    const [solutions, setSolutions] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        let token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login')
            return;
        }
        getdata();
    }, [])


    const getdata = async () => {
        let token = localStorage.getItem('authToken');
        if (!token) {
            dangerToast('Token Not Found');
            return;
        }
        setLoading(true);
        let url = myCodeUrl + '?tags='
        let { data } = await axios.get(url, {
            headers: {
                'Content-Type': 'application/json',
                'authToken': token
            }
        }, { validateStatus: true })
        console.log(data);
        if (data.success) {
            successToast("Solutions Received !!")
            setSolutions(data.data)
        }
        else {
            dangerToast(data.msg);
        }
        setLoading(false);
    }

    return (
        <>
            <section className='container section widgetContainer '>

                <div className="widgets">
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr' }}>

                        <div className="inputBox">
                            <label className="label">Search</label>
                            <input type="text" className="input" autoComplete={false} autoFocus={true} name="search" onChange={(e) => setSearch(e.target.value)} value={search} placeholder="Search" />
                        </div>
                        <div className="inputBox">
                            <label className="label">Liked</label>
                            <input type="checkbox" onChange={() => setLiked(!liked)} className="input" autoComplete={false} autoFocus={true} name="liked" checked={liked} />
                        </div>
                    </div>
                    <h3 className="categoryHeading">MY NEW CODES</h3>
                    <div className="allcards">
                        {
                            solutions?.map((s, index) => {
                                let str = s.question.toLowerCase();
                                if (liked) {
                                    if (s.liked == true) {
                                        return <Link to={'/' + s.slug} key={index} className="card">
                                            <div className="cardHead">
                                                <div className="cardHeadSection">
                                                    <div className="cardLikesSection">
                                                        <h4 className="cardTitle">{s.question}</h4>
                                                        <div className="likesBox">
                                                            {
                                                                s.liked &&
                                                                <span className="cardHeart"><i className="uil uil-heart heart"></i></span>
                                                            }
                                                        </div>
                                                    </div>
                                                    <span className="cardCategory">{s.difficulty || "👻"}</span>
                                                    <span key={index} className="cardDate">{format(s.createdAt)}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    }
                                }
                                else if (str.includes(search) || s.difficulty.includes(search) || s.tags.includes(search)) {
                                    return <Link to={'/' + s.slug} key={index} className="card">
                                        <div className="cardHead">
                                            <div className="cardHeadSection">
                                                <div className="cardLikesSection">
                                                    <h4 className="cardTitle">{s.question}</h4>
                                                    <div className="likesBox">
                                                        {
                                                            s.liked &&
                                                            <span className="cardHeart"><i className="uil uil-heart heart"></i></span>
                                                        }
                                                    </div>
                                                </div>
                                                <span className="cardCategory">{s.difficulty || "👻"}</span>
                                                <span key={index} className="cardDate">{format(s.createdAt)}</span>
                                            </div>
                                        </div>
                                    </Link>
                                }

                            })
                        }
                    </div>
                </div>
            </section >
        </>
    )
}