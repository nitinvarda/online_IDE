import React, { useState } from 'react';
import axios from 'axios';
import './compiler.css'

const Compiler = () => {
    // these are the basic inputs 
    const [code, setCode] = useState({
        source: "",
        lang: "",
        inputs: "",
        input_required: false

    })
    // these are result which are recieved after submiting request
    const [result, setResult] = useState({
        output: "",
        stderr: null,
        time: "",
        compile_Status: "",
        memory_used: ""
    });

    // using es6 destructuring 
    const { source, lang, inputs, input_required } = code


    // when we type code it will be changed according by this function
    const change = (e) => {

        setCode({
            ...code,
            [e.target.name]: e.target.value
        })



    }


    // this is run event function
    const run = (e) => {

        setResult({
            output: "loading...."
        })
        e.preventDefault();
        const data = {
            source,
            lang,
            inputs
        }
        // request is sent through axios here 
        axios.post("/run", data)

            .then(res => {
                console.log(res.data);
                if (res.data.error) {
                    setResult({
                        compile_Status: res.data.error,
                        output: "error"
                    })
                }
                else if (res.data.run_status.output === "") {
                    setResult({
                        output: "program returned nothing, check the source and try again..."
                    })
                }
                else if (res.data.compile_status !== "OK") {
                    setResult({
                        compile_Status: res.data.compile_status,
                        output: res.data.run_status.status_detail
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

    // this is for any inputs for the program
    const input = () => {
        if (input_required) {
            setCode({
                ...code,
                inputs: "",
                input_required: false
            })
        }
        else {
            setCode({
                ...code,
                input_required: true
            })

        }


    }

    // this will reset all the code in the editor
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
    // this is for boilerplate hello world code of each language
    const program = (e) => {
        console.log(e.target.alt)
        if (e.target.alt === "Python") {
            setCode({
                ...code,
                source: 'print("Hello, World!")'
            })
        }
        else if (e.target.alt === "Java") {
            setCode({
                ...code,
                source: 'public class Main {public static void main(String[] args) {System.out.println("Hello, World!");}}'
            })
        }
        else if (e.target.alt === "C++") {
            setCode({
                ...code,
                source: '#include <iostream> // press enter here and clear this comment  int main() {std::cout << "Hello World!";return 0;}'
            })
        }
        else if (e.target.alt === "C") {
            setCode({
                ...code,
                source: '#include <stdio.h> // press enter here and clear this comment int main() { printf("Hello, World!"); return 0;}'
            })
        }
        else {
            setCode({
                ...code
            })
        }
    }


    return (
        <div >
            <h2 style={{ textAlign: "center" }}>Welcome to online <span style={{ color: "red" }}>IDE</span></h2>
            <hr />
            <div className="container">
                <div style={{ paddingBottom: 50 }} >
                    <h4>This is an online IDE where you can write code and run , below are the supported languages</h4>
                    <br />
                    <h5>*tap on  specific language icon to get basic hello world program in editor</h5>

                    <div className="d-flex justify-content-around" style={{ paddingTop: 30, marginBottom: 40 }}>
                        <div>

                            <img onClick={program} alt="Python" src="https://img.icons8.com/ios/50/000000/python.png" />
                            <br />
                            <h6>Python</h6>
                        </div>
                        <div>
                            <img onClick={program} alt="Java" src="https://img.icons8.com/ios-filled/50/000000/java-coffee-cup-logo--v1.png" />
                            <br />
                            <h6 style={{ paddingLeft: 10 }}>Java</h6>
                        </div>
                        <div>

                            <img onClick={program} alt="C++" src="https://img.icons8.com/ios-filled/50/000000/c-plus-plus-logo.png" />
                            <br />
                            <h6 style={{ paddingLeft: 10 }}>C++</h6>
                        </div>
                        <div>
                            <img onClick={program} alt="C" src="https://img.icons8.com/wired/48/000000/c-programming.png" />
                            <br />
                            <h6 style={{ paddingLeft: 18 }}>C</h6>
                        </div>
                    </div>

                    <h5>**warning do not run code before selecting the language.</h5>
                    <h5> if you want to input values manually you can use stdin button right side to run button.</h5>
                    <br />
                    <div className="d-flex justify-content-between">
                        <select name="lang" value={lang} onChange={change} required>
                            <option >select language</option>
                            <option value="Python" >Python</option>
                            <option value="Java">Java</option>
                            <option value="C++">C++</option>
                            <option value="C">C</option>

                        </select>
                    </div>
                    <br />
                    <div >
                        <div><textarea className="source" rows="10" cols="100" name="source" value={source} onChange={change} style={{ fontSize: "large" }} placeholder="enter code here..." required></textarea></div>
                        <br />
                        <div >
                            <div>
                                <div className="d-flex justify-content-around ">
                                    <button className="btn btn-primary btn-border" value="Run" onClick={run}>Run</button> &nbsp;&nbsp;
                                    <button className="btn btn-info btn-border" onClick={input}>stdin</button> &nbsp;&nbsp;
                                    <button className="btn btn-danger btn-border" onClick={clear}>Reset</button>

                                </div>
                                <div className="d-flex justify-content-center" style={{ paddingTop: 20 }}>
                                    {input_required ? (<textarea style={{ padding: 20 }} cols="40" row="10" value={inputs} name="inputs" onChange={change} placeholder=" enter inputs if any here..." ></textarea>) : (<div></div>)}
                                </div>
                            </div>
                            <br />
                            <hr />
                            <div >
                                <div><h5>Compile Status: {result.compile_Status === 'OK' ? (<b style={{ color: "#006600" }}>{result.compile_Status}</b>) : (<p style={{ color: "#cc3300", width: "100%" }}><b >{result.compile_Status}</b></p>)}</h5></div>
                                <br />
                                <hr />
                                <div >
                                    <div className="d-flex flex-row justify-content-around" >

                                        <h5>Time taken:&nbsp; <b>{result.time}</b></h5>
                                    &nbsp;
                                    <h5>Memory used(KB): &nbsp; <b>{result.memory_used}</b></h5>
                                    </div>
                                    <hr />
                                    <div >
                                        <h4 style={{ textAlign: "center", padding: 10 }}>Output</h4>
                                        <h4>

                                            <textarea rows="5" cols="100" placeholder="output will be shown here" value={result.output} />
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >);
}

export default Compiler;
