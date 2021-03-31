import React, { Component } from 'react';
import Web3 from 'web3'
//import logo from '../logo.png';
import './App.css';
import reeler from  '../abis/reeler.json'
import Navbar from './Navbar'
import Main from './Main'

class App extends Component {

  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
    
  }

 async loadWeb3(){
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum)
    await window.ethereum.enable()
  }
  else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider)
  }
  else {
    window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
  }


  }

 async loadBlockchainData(){
   const web3 = window.web3
   //load accounts
   const accounts = await web3.eth.getAccounts()
   this.setState({account: accounts[0]})
   const networkId = await web3.eth.net.getId()
   const networkData = reeler.networks[networkId]
   if(networkData){
   //const abi = reeler.abi
   //const address = reeler.networks[networkId].address
   const Reeler = web3.eth.Contract(reeler.abi, networkData.address)
   this.setState({Reeler})
   const yarncount = await Reeler.methods.yarncount().call()
   this.setState({yarncount})
   for (var i= 1;i<= yarncount; i++){
    const yarn = await Reeler.methods.yarns(i).call()
    this.setState({
      yarns: [...this.state.yarns, yarn]
    })
   }
   this.setState({loading: false})
   console.log(this.state.yarns)
   }
   else{
     window.alert('reelers contract not deployed to detect network')

  }

 }


  constructor(props){
    super(props)
    this.state= {
      account: '',
      yarncount: 0,
      yarns: [],
      loading: true
    }
    this.createYarn=this.createYarn.bind(this)
    this.purchaseYarn=this.purchaseYarn.bind(this)
  }

  createYarn(types,weight,price,colour){
    this.setState({loading: true})
    this.state.Reeler.methods.createYarn(types,weight,price,colour).send({ from: this.state.account })
    .once('receipt', (recepit) => {
      this.setState({ loading: false})
    })
  }
  
  purchaseYarn(yid,price){
    this.setState({loading: true})
    this.state.Reeler.methods.purchaseYarn(yid).send({ from: this.state.account, value: price })
    .once('receipt', (recepit) => {
      this.setState({ loading: false})
    })
  }
  
  render() {
    return (
      <div>
        <Navbar account={this.state.account}/>
        <div className="container-fluid mt-5">
         <div className="row">
           <main role="main" className="col-lg-12 d-flex">
             { this.state.loading 
               ? <div id="loader" className="text-center"><p className="text-center">Loading......</p> </div>
               : <Main 
               yarns={this.state.yarns} 
               createYarn={this.createYarn}
               purchaseYarn={this.purchaseYarn} /> 
              }
              
          </main>
        </div>
      </div>
    </div>
  );
  }
}

export default App;
