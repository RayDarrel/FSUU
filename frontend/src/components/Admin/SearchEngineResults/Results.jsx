import axios from 'axios'
import { Badge } from 'primereact/badge'
import { Button } from 'primereact/button'
import { Divider } from 'primereact/divider'
import { InputText } from 'primereact/inputtext'
import { Panel } from 'primereact/panel'
import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import swal from 'sweetalert'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Pagination from './Pagination'
import { useHistory } from 'react-router-dom'
import { Checkbox } from 'primereact/checkbox';

function Results() {

    const [SearchAgain, setsearchAgain] = useState([])
    const [loading, setloading] = useState(true);
    const history = useHistory();
    const [TotalYear, setTotal] = useState([]);
    const [cities, setCities] = useState([]);
    const [searchkey, setsearch] = useState({
        keyword: "",
        error: [],
    });
    const [listenSpeech, setlisten] = useState(null);
    const [visible, setVisible] = useState(false);


    useEffect(() => {
        SearchAgainData();
    }, [])

    const SearchAgainData = () =>{
        if (localStorage.getItem('keyword')) {
            const id = localStorage.getItem('keyword');
            axios.post(`/api/SearchEngineResults/${id}`,).then(res => {
                if (res.data.status === 200) {
                    setsearchAgain(res.data.ResultsOutput)
                    setTotal(res.data.Total)
                }
                else if (res.data.status === 404) {
                    swal("Error", res.data.error, 'error');

                }
                setloading(false)
            });
        }
        else {
            history.push('/admin/search');
        }
    }

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
            axios.post(`/api/SearchEngined`, data).then(res => {
                if (res.data.status === 200) {
                    window.location.href = `/admin/search=${data.search}`;
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

    const FilterYear = (e) => {
        e.preventDefault();

        if (cities.length > 0) {
            const data = {
                year: cities,
                keyword: localStorage.getItem('keyword'),
            }
            axios.post(`/api/DocumentFilter`, data).then(res => {
                if (res.data.status === 200) {
                    setsearchAgain(res.data.ResultsOutput)
                }
            }).catch((error) => {
                if (error.response.status === 500) {
                    swal("Warning", error.response.statusText, 'warning');
                }
            })
        }
        else {
            SearchAgainData();
        }
    }

    const onCityChange = (e) => {
        let selectedCities = [...cities];
        if (e.checked) {
            selectedCities.push(e.value);
        }
        else
            selectedCities.splice(selectedCities.indexOf(e.value), 1);
        setCities(selectedCities);

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
        axios.post(`/api/SearchEngined`, newdata).then(res => {
            if (res.data.status === 200) {
                localStorage.setItem('keyword', data.keyword);
                window.location.href = `/admin/search=${newdata.search}`;
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

    console.log(TotalYear)

    return (
        <div>
            <Panel>

                <form onSubmit={Search}>
                    <h4 className='text-details'><FaSearch /> FSUU Search Engine </h4>
                    <div className="p-inputgroup">
                        <InputText onChange={handleinput} name='keyword' placeholder="Input Title, Keyword, or Barcode #" />
                        <Button icon="pi pi-search" className="p-button-info me-1" />
                        {/* <Button icon="pi pi-microphone" onClick={Microphone} className="p-button-info" /> */}
                    </div>
                </form>
                <Divider>
                    <Badge value="Search Results" />
                </Divider>
                <div className="container">
                    <div className="row">
                        <div className="col-md-2">
                            <h5 className='text-secondary'>Results</h5>
                            <Divider></Divider>
                            <center><h6 className='text-secondary'>Year Published Filter</h6></center>
                            <ul className='mt-2'>
                                <form onSubmit={FilterYear}>
                                    {
                                        TotalYear.map((datayear, id) => {
                                            return (
                                                <li key={id} className='mb-3'><Checkbox key={id} inputId="cb1" value={datayear.Year_Published} onChange={onCityChange} checked={cities.includes(datayear.Year_Published)} className="me-2 p-checkbox "></Checkbox>
                                                    <label htmlFor="cb1" className="p-checkbox-label ">{datayear.Year_Published} - {datayear.total}</label>

                                                </li>
                                            )
                                        })
                                    }
                                    <Button className='p-button-sm' icon="pi pi-fw pi-search" label='Search'></Button>
                                </form>
                            </ul>
                        </div>
                        <div className="col-md-10">
                            <Pagination data={SearchAgain} />
                        </div>
                    </div>
                </div>
                {/* <Paginate data={SearchAgain}/> */}

            </Panel>
        </div>
    )
}

export default Results