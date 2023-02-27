import axios from 'axios'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import { InputText } from 'primereact/inputtext'
import { Panel } from 'primereact/panel'
import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { useHistory } from 'react-router-dom'
import swal from 'sweetalert'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Dialog } from 'primereact'
import { useEffect } from 'react'

function SearchEngine() {

    const history = useHistory();
    const [searchkey, setsearch] = useState({
        keyword: "",
        error: [],
    });
    const [listenSpeech, setlisten] = useState(null);
    const [visible, setVisible] = useState(false);

    const handleinput = (e) => {
        e.persist();
        setsearch({ ...searchkey, [e.target.name]: e.target.value });
    }

    const commands = [
        {
            command: 'reset',
            callback: ({ resetTranscript }) => resetTranscript()
        },
        {
            command: 'open *',
            callback: (site) => {
                window.open('http://' + site + ".com");
            }
        }
    ];

    const {
        transcript,
        interimTranscript,
        finalTranscript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition({ commands });

    useEffect(() => {
        if (finalTranscript !== '') {
            localStorage.setItem('keyword', finalTranscript);
            const id = localStorage.getItem('keyword');
            const data = {
                search: localStorage.getItem('keyword'),
                user_id: localStorage.getItem('auth_id'),
            }
            axios.post(`/api/SearchEngine`, data).then(res => {
                if (res.data.status === 200) {
                    history.push(`/student/search=${data.search}`)
                }
                else if (res.data.status === 404) {
                    swal("Error", res.data.error, 'error');
                    setVisible(false);
                    resetTranscript();
                }
            }).catch((error) => {
                if (error.response.status === 500) {
                    swal("Warning", error.response.statusText, 'warning');
                }
            })
        }
    }, [interimTranscript, finalTranscript]);






    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    const Microphone = () => {
        SpeechRecognition.startListening({ language: "en-US" });
        setVisible(true)
        
    }

    const Search = (e) => {

        e.preventDefault();
        const data = {
            keyword: searchkey.keyword,
        };
        localStorage.setItem('keyword', data.keyword);

        if (data.keyword === "") {
            // alert("Please Enter some Keywords or Title")
        }
        else {
            const newdata = {
                search: localStorage.getItem('keyword'),
                user_id: localStorage.getItem('auth_id'),
            }
            axios.post(`/api/SearchEngine`, newdata).then(res => {
                if (res.data.status === 200) {
                    history.push(`/student/search=${newdata.search}`)
                }
                else if (res.data.status === 404) {
                    swal("Error", res.data.error, 'error');
                }
            }).catch((error) => {
                if (error.response.status === 500) {
                    swal("Warning", error.response.statusText, 'warning');
                }
            })
        }
    }

    return (
        <div>
            <Panel>
            <div className="p-5 bg-image text-center">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="text-container">
                                    <h1 className='text-light title-head'>FATHER SATURNINO URIOS UNIVERSITY</h1>
                                    <br />
                                    <span className='text-light fs-4 font-weight-500'>THESIS COLLECTIONS</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <form onSubmit={Search}>
                    <h4 className='text-details'><FaSearch /> FSUU Search Engine </h4>
                    <div className="p-inputgroup">
                        <InputText onChange={handleinput} name='keyword' placeholder="Keyword, Title" />
                        <Button icon="pi pi-search" className="p-button-info me-1" />
                        <Button icon="pi pi-microphone" onClick={Microphone} className="p-button-info" />
                    </div>
                </form>
                <Dialog position='top' header={listening ? <h4>Listening...</h4> : <h4>Searching...</h4>} visible={visible} onHide={() => setVisible(false)}
                    style={{ width: '40vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                    <p className="m-0 text-light py-3 fs-5">
                        {transcript}
                    </p>
                </Dialog>
                <Divider></Divider>
            </Panel>
        </div>
    )
}

export default SearchEngine