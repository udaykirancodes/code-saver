import React, { useState, useEffect } from 'react'
import Editor from '../../Components/AceEditor/Editor'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { addCodeUrl } from '../../url'
import { dangerToast, successToast } from '../../Components/Toast/Toast';

export default function Write({ darkTheme }) {
    const [input, setInput] = useState({
        question: '',
        link: '',
        tags: '',
        difficulty: '',
        liked: false
    });
    const [solutions, setSolutions] = useState([
        {
            language: 'cpp',
            code: '',
        }
    ])

    const [loading, setLoading] = useState(false);
    const upload = async () => {
        let token = localStorage.getItem('authToken');
        if (!token) {
            dangerToast('Token Not Found');
            return;
        }
        setLoading(true);
        let obj = {
            question: input.question,
            link: input.link,
            difficulty: input.difficulty,
            tags: input.tags.split(','),
            solutions: solutions,
            liked: input.liked
        }
        let { data } = await axios.post(addCodeUrl, obj, {
            headers: {
                'Content-Type': 'application/json',
                'authToken': token
            }
        }, { validateStatus: true })
        console.log(data);
        if (data.success) {
            successToast("Uploaded")
            navigate('/')
        }
        else {
            dangerToast(data.msg);
        }
        setLoading(false);
    }

    const navigate = useNavigate();
    useEffect(() => {
        let token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
        }
    }, [])


    const handleChange = (e) => {
        console.log(input)
        if (e.target.name == 'liked') {
            if (document.getElementById('mycheck').checked) {
                setInput({ ...input, [e.target.name]: true })
            }
            else {
                setInput({ ...input, [e.target.name]: false })
            }
        }
        else {
            setInput({ ...input, [e.target.name]: e.target.value })
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
    // update
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
        console.log(solutions)
    }, [solutions])

    return (
        <>
            <div className="container">
                <h1 className="title">Write Here</h1>
                <section className="section  writeContainer">
                    <div className="writeLeft">
                        <div className="inputForQ">
                            <div className="inputBox">
                                <label htmlFor="" className="writeSubtitle">Question</label>
                                <input type="text" className="input" name="question" value={input.question} onChange={(e) => handleChange(e)} placeholder="Question Name" />
                            </div>
                            <div className="inputBox">
                                <label htmlFor="" className="writeSubtitle">Link</label>
                                <input type="text" className="input" name="link" value={input.link} onChange={(e) => handleChange(e)} placeholder="Link of Question" />
                            </div>
                        </div>
                        {
                            solutions.map((sol, index) => {
                                return (
                                    <div className="inputBox codeHolder" key={index}>
                                        <label className="writeSubtitle">Code</label>
                                        <Editor code={sol.code} darkTheme={darkTheme} solutions={solutions} updateObjectInArray={updateObjectInArray} setSolutions={setSolutions} index={index} />
                                        <div className="floatsButtons">
                                            <input onClick={() => removeObjectFromArray(index)} className="button input inputButton mr" type="button" value="Remove" />
                                            <input onClick={addObjectToArray} className="button input inputButton" type="button" value="Add" />
                                        </div>
                                    </div>
                                )
                            })
                        }
                        <div className='input' style={{ display: 'flex', gap: '10px' }}>
                            <label htmlFor="easy">
                                <input type="radio" name="difficulty" value="easy" onChange={handleChange} id="easy" /> Easy
                            </label>
                            <label htmlFor="medium">
                                <input type="radio" name="difficulty" id="medium" value="medium" onChange={handleChange} /> Medium
                            </label>
                            <label htmlFor="hard">
                                <input type="radio" name="difficulty" id="hard" value="hard" onChange={handleChange} /> Hard
                            </label>
                        </div>
                        <div className='input' style={{ display: 'flex', marginTop: '10px', gap: '10px' }}>
                            <label htmlFor="mycheck">
                                <input type="checkbox" style={{ marginRight: '10px' }} name="liked" onChange={handleChange} id="mycheck" value={input.liked} />
                                Add to Favorites
                            </label>
                        </div>
                        <div className="bottomInputs">
                            <div className="inputBox">
                                <label htmlFor="" className="writeSubtitle">Tags</label>
                                <input type="text" autoComplete={false} className="input" value={input.tags} onChange={(e) => handleChange(e)} name="tags" placeholder="tags" />
                            </div>
                            <div class="inputBox">
                                <label htmlFor="" class="writeSubtitle">Upload</label>
                                <button type="button" onClick={upload} class="input blogPost center" ><p class="buttonText">{loading ? "Loading" : "Save Code"}</p></button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}
