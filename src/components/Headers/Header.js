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
import axios from "axios";
//import Modal from '../../views/Modal';

// reactstrap components
import { Card, CardBody, Container, Row, Col, Button } from "reactstrap";

const api = {
    baseUrl: `http://127.0.0.1:8000/api/wifi/`,
    urlToken: `http://localhost:8000/api/auth/`
};

class Header extends React.Component {
      /* Primeira letra de uma string maiscula */
      capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
      }
      
      constructor(props) {
        super(props);
        this.state = {
            wifi: [],
            isShowing: false
        };
    }
        openModalHandler = () => {
        this.setState({
            isShowing: true
        });
        console.log(1);
    }

    closeModalHandler = () => {
        this.setState({
            isShowing: false
        });
    }
      componentDidMount(){
      axios.get(
        api.baseUrl, { headers: {"Authorization" : `Token 90983948ea3a66581227202c25183ef2e34ac430`} }
      ).then((res) => {
        this.setState({wifi: res.data.wireless})
        //console.log(res.data.wireless)
      })
    }

   getValues(el) {
       var lst = [];
       lst = el.target.value.split("-");
       //alert(lst[0]);
       //alert(lst[1]);
       //alert(lst[2]);

       /*Converte de Lista para Objeto utilizando o SPREAD do JavaScript ES6*/
       //lst = { ...lst };
       //alert(lst);
       console.log(lst);
       window.location.replace(`/admin/pentest?mac=${lst[0]}&ssid=${lst[1]}`);
   }

  render() {
    return (

    <React.Fragment>
      <>
        <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
          <Container fluid>
            <div className="header-body">
              {/* Card stats */}
              <Row>{this.state.wifi.map((w, index)=>
                <Col lg="6" xl="3">
                   <Card className="card-stats mb-xl-5">
                    <CardBody style={{'whiteSpace': 'pre-line'}}><img src="https://image.flaticon.com/icons/svg/2916/2916682.svg" alt="wireless" width="30px" align="left"></img>
                         <div style={{color: '#00BFFF',textAlign: 'center'}}><strong>Rede sem fio</strong></div>
                            <p>{w.escape}
                                <strong>SSID: </strong>{w.ssid}
                                <strong>Frequência: </strong>{w.frequency}
                                <strong>Qualidade: </strong>{w.quality}
                                <strong>MAC: </strong>{w.address}
                                <strong>Criptografia: </strong>{w.encryption_type}
                                <strong>Modo: </strong>{w.mode}
                            </p>

                        <Button className="" color="info" type="text" value={w.address + "-" + w.ssid + "-" + w.encryption_type}  type="submit" onClick={this.getValues}>Port Scanner</Button>
                    </CardBody>
                   </Card>
                </Col>)}
              </Row>
            </div>
          </Container>
        </div>

      </>
      </React.Fragment>
    );
  }
}
                            /*{ this.state.isShowing ? <div onClick={this.closeModalHandler} className="back-drop"></div> : null }*/         /*
                                                <Modal
                    className="modal"
                    show={this.state.isShowing}
                    close={this.closeModalHandler}>
                        {w.ssid}
                </Modal>
                                */
export default Header;
