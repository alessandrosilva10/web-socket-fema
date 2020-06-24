/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// javascipt plugin for creating charts
import Chart from "chart.js";
import { withCookies } from "react-cookie";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import ListNotes from './ListNotes';
//import { fetchNotes, fetchNote, updateNote } from '../../src/api';
import AddNoteForm from "./AddNoteForm";
import EditNoteForm from "./EditNoteForm";
import Websocket from 'react-websocket';
// reactstrap components
import {
  Container,
  Row,
  Col,
  Button
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
} from "variables/charts.js";

import Header from "components/Headers/Header.js";

class Index extends React.Component {
   sucess = () => toast.success("Usuário logado com sucesso!");
   warning = () => toast.warning("Usuário não autenticado!");

  constructor(props){
    super(props);

    this.state = {
      activeNav: 1,
      chartExample1Data: "data1",
      notes: [],
      note: {},
      current_note_id: 0,
      is_creating: true
    };

    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleAddItem = this.handleAddItem.bind(this);
    this.addNote = this.addNote.bind(this);
    this.getData = this.getData.bind(this);
    this.handleSaveNote = this.handleSaveNote.bind(this);
    this.fetchNotes = this.fetchNotes.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this)

    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
  }

  toggleNavs = (e, index) => {
    e.preventDefault();
    this.setState({
      activeNav: index,
      chartExample1Data:
        this.state.chartExample1Data === "data1" ? "data2" : "data1"
    });
  };

   async getData(){
     fetch(this.url, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${this.props.cookies.get('token')}`
        }
      }).then( resp => resp.json()).then( res => this.setState({notes: res}, function() {
            console.log(this.state.notes)
            console.log(this.props.cookies.get('token'))
      }))
      .catch(error => console.log(error))

    }

  async handleItemClick(id) {
    let selected_note = await this.fetchNote(id);

    this.setState((prevState) => {
      return {
        is_creating: false,
        current_note_id: id,
        note: selected_note
      }
    })
  }

    handleAddItem(){
        this.setState((prevState) => {
            return{is_creating: true}
        })
    }

  componentDidMount(){
       this.sucess()
        fetch('http://127.0.0.1:8000/api/v1/notes/', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${this.props.cookies.get('token')}`
        }
      }).then( resp => resp.json()).then( res => this.setState({notes: res}, function() {
            console.log(this.state.notes)
            console.log(this.props.cookies.get('token'))
      }))
      .catch(error => console.log(error))
    }

    url = 'http://127.0.0.1:8000/api/v1/notes/';

    fetchNotes = async () => {
        fetch(this.url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
           'Authorization': `Token ${this.props.cookies.get('token')}`
        }
      })
      .then(res => res.json())
      .then(data => {
            return(data);
      })
    }

  fetchNote = (id) => {
  return fetch(`${this.url + id}`, {headers: {
           'Authorization': `Token ${this.props.cookies.get('token')}`
        }})
    .then(res => res.json())
    .then(data => {
      return data;
    });
}

    addNote = (note) => {
      fetch(this.url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Token ${this.props.cookies.get('token')}`
        },
        body: JSON.stringify(note)
      })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })

      return note;
    }

    async handleSaveNote(data){
        await this.addNote(data);
        await this.getData();
    }

    handleData(data){

        let result = JSON.parse(data);
        //let current_note = this.state.note;

        if(this.state.current_note_id === result.id){
            this.setState({note: result})
        }
    }

 handleOnChange(e) {
    let content = e.target.value;
    let current_note = this.state.note;
    current_note.content = content;

    this.setState({
      note: current_note
    });

    const socket = this.refs.socket;
    socket.state.ws.send(JSON.stringify(current_note));
  }

    render() {
        let token = this.props.cookies.get('token')
        if(token === null || token === "undefined"){
        return (
            window.location.replace('/auth/login')
        )
        }else{
          return (
          <>
            <Header />
            <Container className="mt--7" fluid>
                 <Col xs="2">
                        <Button color="primary" onClick={this.handleAddItem}>Criar um novo</Button>
                    </Col>
                    <Row>
                        <Col xs="4">
                            <ListNotes notes={this.state.notes} handleItemClick={(id) => this.handleItemClick(id)} />
                        </Col>
                         <Col xs="8">
                              {
                                this.state.is_creating ?
                                <AddNoteForm handleSave={this.handleSaveNote}/> :
                                <EditNoteForm handleChange={this.handleOnChange} note={this.state.note}/>
                              }
                              <Websocket ref="socket" url='ws://localhost:8000/ws/notes'
                              onMessage={this.handleData.bind(this)}/>
                         </Col>
                    </Row>
              <Row className="mt-5">
                  <ToastContainer />
              </Row>
            </Container>
          </>
        );
        }
    }
  }

export default withCookies(Index);
