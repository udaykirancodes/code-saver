import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { dangerToast, successToast } from '../../Components/Toast/Toast';
import { getOneUrl, editOneUrl } from '../../url';
import AceEditor from "react-ace";

export default function SinglePage() {

    const params = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [solutions, setSolutions] = useState([
        {
            language: 'cpp',
            code: ''
        }
    ])
    const [input, setInput] = useState({
        link: '',
        id: '',
        question: '',
        tags: '',
    })

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
            let obj = data.data[0];
            setInput({
                link: obj.link,
                question: obj.question,
                id: obj._id,
                tags: obj.tags.join(',')
            })
            setSolutions(data.data[0].solutions);
        }
        else {
            dangerToast(data.msg)
            navigate('/');
        }
    }
    // add to end 
    const addObjectToArray = () => {
        setSolutions(current => [...current, { language: 'cpp', code: '' }]);
    };
    // delete
    const removeObjectFromArray = (i) => {
        if (solutions.length === 1) {
            return;
        }
        setSolutions(current =>
            current.filter((obj, index) => {
                if (index !== i) {
                    return obj
                }
            }),
        );
    };
    const updateObjectInArray = (i, code) => {
        setSolutions((current) =>
            current.map((obj, index) => {
                if (index === i) {
                    return { language: 'cpp', code: code };
                }
                return obj;
            }),
        );
    };


    useEffect(() => {
        console.log(params.slug)
        getdata()
    }, [])

    const onChange = (index, code) => {
        updateObjectInArray(index, code)
    }
    const handleChange = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
        console.log(input)
    }
    const update = async () => {
        let token = localStorage.getItem('authToken');
        if (!token) {
            return;
        }
        setLoading(true);
        let obj = {
            question: input.question,
            link: input.link,
            solutions: solutions,
            id: input.id,
            tags: input.tags
        }
        let { data } = await axios.put(editOneUrl, obj, {
            headers: {
                'Content-Type': 'application/json',
                'authToken': token
            }
        }, { validateStatus: true })
        if (data.success) {
            successToast("Uploaded")
            navigate('/' + data.data.slug)
        }
        else {
            dangerToast(data.msg);
        }
        setLoading(false);
    }

    return (
        <div className='container singlepage'>
            <div className='inputForQ'>
                <div className="inputBox" style={{ margin: '1rem 0' }}>
                    <label className="label">Name : </label>
                    <input type="text" value={input.question} onChange={(e) => handleChange(e)} className="input" autoComplete={false} autoFocus={true} name="question" placeholder="Question" />
                </div>
                <div className="inputBox" style={{ margin: '1rem 0' }}>
                    <label className="label">Tags : </label>
                    <input type="text" value={input.tags} className="input" autoComplete={false} autoFocus={true} name="tags" onChange={(e) => handleChange(e)} placeholder="Tags" />
                </div>
            </div>
            <div className='inputForQ'>
                <div className="inputBox" style={{ margin: '1rem 0' }}>
                    <label className="label">Link : </label>
                    <a className="link" target="_blank" href={input.link}>Practice Question Link</a>
                </div>
                <div class="inputBox">
                    <label htmlFor="" class="writeSubtitle">Update</label>
                    <button type="button" onClick={update} class="input blogPost center" ><p class="buttonText">{loading ? "Loading" : "Save Code"}</p></button>
                </div>
            </div>

            {
                solutions.map((s, index) => {
                    return <div style={{ marginTop: '1rem', position: 'relative' }} key={index}>
                        <p className="mt">{index + 1} Solution </p>

                        <AceEditor
                            mode="c_cpp"
                            theme={'one_dark'}
                            onChange={(code) => onChange(index, code)}
                            width={'100%'}
                            value={s.code}
                            fontSize={16}
                            name="UNIQUE_ID_OF_DIV"
                            editorProps={{ $blockScrolling: false }}
                        />
                        <div className="floatsButtons" style={{ position: 'absolute', right: '10px' }}>
                            <input onClick={() => removeObjectFromArray(index)} className="button buttonText input inputButton mr" type="button" value="Remove" />
                            <input onClick={addObjectToArray} className="button buttonText input inputButton" type="button" value="Add" />
                        </div>

                    </div>
                })
            }
        </div>
    )
}
