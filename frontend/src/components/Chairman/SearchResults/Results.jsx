import axios from 'axios'
import { Badge } from 'primereact/badge'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import { InputText } from 'primereact/inputtext'
import { Panel } from 'primereact/panel'
import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import swal from 'sweetalert'
import Paginate from './Paginate'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Dialog } from 'primereact'

function Results() {

    const [SearchAgain, setsearchAgain] = useState([])
    const [loading, setloading] = useState(true);
    const [searchkey, setsearch] = useState({
        keyword: "",
        error: [],
    });
    const [listenSpeech, setlisten] = useState(null);
    const [visible, setVisible] = useState(false);
    

    useEffect(() => {
        const id = localStorage.getItem('keyword');
        axios.post(`/api/SearchEngineResultstaff/${id}`,).then(res => {
            if (res.data.status === 200) {
                setsearchAgain(res.data.ResultsOutput)
            }
            else if (res.data.status === 404) {
                swal("Error", res.data.error, 'error');
            }
            setloading(false)
        });
    }, [])

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
            axios.post(`/api/SearchEngineResults`, data).then(res => {
                if (res.data.status === 200) {
                    window.location.href= `/student/search=${data.search}`;
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
        const newdata = {
            search: data.keyword,
            user_id: localStorage.getItem('auth_id'),
        }
        axios.post(`/api/SearchEngineStaff`, newdata).then(res => {
            if (res.data.status === 200) {
                localStorage.setItem('keyword', data.keyword);
                window.location.href= `/student/search=${newdata.search}`;
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

    return (
        <div>
            <Panel>
                
                <form onSubmit={Search}>
                    <h4 className='text-details'><FaSearch /> FSUU Search Engine </h4>
                    <div className="p-inputgroup">
                        <InputText  onChange={handleinput} name='keyword' placeholder="Keyword, Title" />
                        <Button icon="pi pi-search" className="p-button-info me-1" />
                        {/* <Button icon="pi pi-microphone" onClick={Microphone} className="p-button-info" /> */}
                    </div>
                </form>
                <Divider>
                    <Badge value="Result" />
                </Divider>
                <Paginate data={SearchAgain}/>
            </Panel>
        </div>
    )
}

export default Results