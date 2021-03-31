pragma solidity ^0.5.16;

contract reeler{
  uint public id;
  string public name;
  string public addres;
  string public state;
  string public pincode;
  uint public yarncount = 0;
  mapping(uint => Yarn) public yarns;
  

  struct Yarn{
    address payable owner;
    uint yid;
    string types;
    string weight;
    uint price;
    string colour; 
  }

  event YarnCreated(
    address payable owner,
    uint yid, 
    string types,
    string weight,
    uint price,
    string colour
  );
  event YarnPurchased(
    address payable owner,
    uint yid, 
    string types,
    string weight,
    uint price,
    string colour
  );
    constructor() public {
    id= 1098;
    name="joy";
    addres="mysore";
    state="karnataka";
    pincode="560043";
    }

  function  createYarn(string memory _types, string memory _weight, uint _price, string memory _colour) public {
        //make sure parameters are correct
        //require valid name
        require(bytes(_types).length > 0);
        //require valid weight
        require(bytes(_weight).length > 0);
        //require valid price
        require(_price > 0);
        //require valid clour
        require(bytes(_colour).length > 0);
         //increment product count
        yarncount ++;
        //create product
        yarns[yarncount]= Yarn(msg.sender, yarncount, _types, _weight, _price, _colour);
        //trigger event
        emit YarnCreated(msg.sender, yarncount, _types, _weight, _price, _colour);
        
  }
  function purchaseYarn(uint _yid) public payable {
    // fetch the product
    Yarn memory _yarn= yarns[_yid];
    //fetch the owner
    address payable _seller = _yarn.owner;
    //make sure the yarn has a valid id
    require(_yarn.yid > 0 && _yarn.yid <= yarncount);
    //require enough ether for transaction
    require(msg.value >= _yarn.price);
    //require that the buyer is not seller
    require(_seller != msg.sender);
    //purchase it
    _yarn.owner = msg.sender;
    //update the product
    yarns[_yid]= _yarn;
    //pay the seller by ethers
    address(_seller).transfer(msg.value);
    //trigger event
    emit YarnPurchased(msg.sender, yarncount, _yarn.types, _yarn.weight, _yarn.price, _yarn.colour);
  }
}


