import React, { Component } from 'react';

class Main extends Component {

  render() {
    return (
      <div id="content">
        <h1>Add Yarn</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const types = this.yarnTypes.value
          const weight = this.yarnWeight.value 
          const price = window.web3.utils.toWei(this.yarnPrice.value.toString(), 'Ether')
          const colour = this.yarnColour.value
          this.props.createYarn(types,weight,price,colour)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="yarnTypes"
              type="text"
              ref={(input) => { this.yarntypes = input }}
              className="form-control"
              placeholder="Yarn Name"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="yarnWeight"
              type="text"
              ref={(input) => { this.yarnWeight = input }}
              className="form-control"
              placeholder="Yarn weight"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="yarnPrice"
              type="text"
              ref={(input) => { this.yarnPrice = input }}
              className="form-control"
              placeholder="Yarn Price"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="yarnColour"
              type="text"
              ref={(input) => { this.yarnColour = input }}
              className="form-control"
              placeholder="Yarn colour"
              required />
          </div>
          <button type="submit" className="btn btn-primary">Add Product</button>
        </form>
        <p>&nbsp;</p>
        <h2>Buy Product</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Owner</th>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">weight</th>
              <th scope="col">price</th>
              <th scope="col">colour</th>
            </tr>
          </thead>
          <tbody id="yarnList">
           {this.props.yarns.map((yarn, key) => {
            //  console.log(yarn);
             return(
              <tr key={key}>
              <td>{yarn.owner}</td>  
              <th scope="row">{yarn.yid.toString()}</th>
              <td>{yarn.types}</td>
              <td>{yarn.weight}</td>
              <td>{window.web3.utils.fromWei(yarn.price.toString(), 'Ether')}eth</td>
              <td>{yarn.colour}</td>
               <td>
                { !yarn.purchased
                  ? <button
                    name={yarn.id} 
                    value={yarn.price}
                    onClick={(event) => {
                      //console.log("clicked.....")
                      this.props.purchaseYarn(event.target.name, event.target.value)
                    } }
                   >
                      Buy
                    </button>
                  :null
                }   
                </td>
             </tr>
            )
          })}
            
            
            
          </tbody>
        </table>
      </div>
    );
  }
}

export default Main;
