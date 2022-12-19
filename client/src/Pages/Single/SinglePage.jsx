import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { dangerToast, successToast } from '../../Components/Toast/Toast';
import { getOneUrl } from '../../url';
import { Link } from 'react-router-dom';
import AceEditor from "react-ace";

export default function SinglePage() {

    const params = useParams();
    const navigate = useNavigate();
    const [solution, setSolution] = useState({})

    const getdata = async () => {
        let token = localStorage.getItem('authToken');
        if (!token) {
            return;
        }
        let { data } = await axios.get(getOneUrl + params.slug,
            {
                headers: {
                    'authToken': token,
                }
            },
            { validateStatus: false })
        if (data.success) {
            successToast("Recieved")
            setSolution(data.data[0]);
        }
        else {
            dangerToast(data.msg)
            navigate('/');
        }
    }

    useEffect(() => {
        console.log(params.slug)
        getdata()
    }, [])

    const onChange = (code) => {

    }

    return (
        <div className='container singlepage'>
            <div className='inputForQ'>
                <div className="inputBox" style={{ margin: '1rem 0' }}>
                    <label className="label">Name : </label>
                    <input type="text" value={solution.question} className="input" autoComplete={false} autoFocus={true} name="email" placeholder="Email" />
                </div>
                <div className="inputBox" style={{ margin: '1rem 0' }}>
                    <label className="label">Tags : </label>
                    <input type="text" value={solution.tags} className="input" autoComplete={false} autoFocus={true} name="tags" placeholder="Tags" />
                </div>
            </div>
            <div className='inputForQ'>
                <div className="inputBox" style={{ margin: '1rem 0' }}>
                    <label className="label">Link : </label>
                    <a className="link" target="_blank" href={solution.link}>Practice Question Link</a>
                </div>
                <div className="inputBox" style={{ margin: '1rem 0' }}>
                    <label className="label">Edit : </label>
                    <Link className="link" to={'/edit/' + solution.slug}>Click Here to Edit</Link>
                </div>
            </div>

            {
                solution.solutions?.map((s, index) => {
                    return <div style={{ marginTop: '1rem' }} key={index}>
                        <p className="mt">{index + 1} Solution </p>
                        <AceEditor
                            mode="c_cpp"
                            theme={'one_dark'}
                            onChange={onChange}
                            width={'100%'}
                            value={s.code}
                            fontSize={16}
                            name="UNIQUE_ID_OF_DIV"
                            editorProps={{ $blockScrolling: false }}
                        />
                    </div>
                })
            }
        </div>
    )
}
