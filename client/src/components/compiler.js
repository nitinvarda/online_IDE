import React, { useState } from 'react';
import axios from 'axios';
import './compiler.css'

const Compiler = () => {
    const [code, setCode] = useState({
        source: "",
        lang: "",
        inputs: ""

    })
    const [result, setResult] = useState({
        output: "",
        stderr: null,
        time: "",
        compile_Status: "",
        error: "",
        memory_used: ""
    });

    const { source, lang, inputs } = code
    const change = (e) => {
        setCode({
            ...code,
            [e.target.name]: e.target.value
        })

    }
    const submit = (e) => {
        setResult({
            output: "loading...."
        })
        e.preventDefault();
        const data = {
            source,
            lang,
            inputs
        }
        axios.post("/run", data)
            .then(res => {
                console.log(res.data);
                if (res.data.error) {
                    setResult({
                        error: res.data.error
                    })
                }
                else if (res.data.run_status.output === "") {
                    setResult({
                        output: "program returned nothing..."
                    })
                }
                else {
                    setResult({
                        output: res.data.run_status.output,
                        stderr: res.data.run_status.stderr,
                        time: res.data.run_status.time_used,
                        compile_Status: res.data.compile_status,
                        memory_used: res.data.run_status.memory_used
                    })
                }
            })
    }



    // const compile = (e) => {
    //     setResult({
    //         output: ""
    //     })
    //     e.preventDefault();
    //     const data = {
    //         source,
    //         lang,
    //         inputs
    //     }
    //     axios.post("/compile", data)
    //         .then(res => {
    //             console.log(res.data);
    //             setResult({
    //                 compile_Status: res.data.compile_status,
    //                 error: res.data.error
    //                 // compile_Status: res.data.run_status.stderr
    //             })

    //         })
    //         .catch(err => {
    //             console.log(err);
    //             // setResult({
    //             //     err: err
    //             // })
    //         })
    // }


    const clear = () => {
        setCode({
            source: "",
            lang: "",
            inputs: ""
        })

        setResult({
            output: "",
            stderr: "",
            time: "",
            compile_Status: "",
            error: "",
            memory_used: ""
        })


    }
    return (
        <div className="container">
            <div >
                <h2 style={{ textAlign: "center" }}>Welcome to online IDE</h2>
                <hr />
                <h4>Hello, this is online IDE where you can write code and run them in four different languages Python, Java,C++ and C</h4>
                {result.error}
                <div className="d-flex justify-content-between">
                    <select name="lang" value={lang} onChange={change} required>
                        <option >select language</option>
                        <option value="Python">Python</option>
                        <option value="C">C</option>
                        <option value="Java">Java</option>
                        <option value="C++">C++</option>

                    </select>


                </div>
                <br />
                <h5>compile status: {result.compile_Status}</h5>
                <div className="code_area ">
                    <div >

                        <textarea rows="10" cols="40" name="source" value={source} onChange={change} style={{ fontSize: "x-large" }} placeholder="enter code here..." required></textarea>
                    </div>
                    <div >
                        <div className="d-flex flex-column justify-content-between">


                            <textarea cols="60" row="10" value={inputs} name="inputs" onChange={change} placeholder=" enter inputs if any here..." />
                            <br />
                            {result.output ?
                                (<div>
                                    <div className="d-flex justify-content-between">
                                        <h5>Time taken: {result.time}</h5>
                                        <h5>Memory used(KB):{result.memory_used}</h5>
                                    </div>
                                    <h5>Output</h5>


                                </div>) : (<div>{result.stderr}</div>)
                            }
                            {result.output ? (result.stderr ? (<textarea rows="5" cols="60" style={{ fontSize: "large" }} placeholder="output will be shown here" readOnly={result.stderr} />) : (<textarea rows="5" cols="60" placeholder="output will be shown here" value={result.output} />)) : (<div></div>)}


                        </div>
                        <br />


                    </div>
                </div>
                <div className="d-flex justify-content-start">
                    <input className="btn btn-primary" type="submit" value="Run" onClick={submit} />&nbsp;&nbsp;
                    <input className="btn btn-danger" type="submit" onClick={clear} value="clear" />

                </div>

            </div>






        </div >);
}

export default Compiler;
