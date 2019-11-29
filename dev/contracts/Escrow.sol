pragma solidity >= 0.4 .0 < 0.6 .0;

contract Escrow{
    address payable public buyer;
    address payable public seller;
    address public arbiter;
    uint public productId;
    uint public amount;
    mapping(address => bool) releaseAmount;
    mapping(address => bool) refundAmount;
    uint public releaseCount;
    uint public refundCount;
    bool public fundsDisbursed;
    address public owner;

    constructor(uint _productId, address payable _buyer, address payable _seller, address _arbiter) payable public{
        buyer = _buyer;
        seller = _seller;
        arbiter = _arbiter;
        fundsDisbursed = false;
        productId = _productId;
        amount = msg.value;
        owner = msg.sender;
    }

    function escrowInfo() view public returns(address, address, address, bool, uint, uint){
        return (buyer, seller, arbiter, fundsDisbursed, releaseCount, refundCount);
    }
    
    function releaseAmountToSeller(address caller) public{
        require(fundsDisbursed == false);
        require(msg.sender == owner);
        if((caller == seller || caller ==buyer || caller == arbiter) && releaseAmount[caller] != true){
            releaseAmount[caller] = true; // caller는 release amount 에 대해서 찬성
            releaseCount += 1;
        }
        
        if (releaseCount == 2){
            seller.transfer(amount);
            fundsDisbursed = true;
        }   
    }
    function refundAmountToBuyer(address caller) public{
        require(fundsDisbursed == false);
        require(msg.sender == owner);
        if((caller == seller || caller == buyer || caller == arbiter) && refundAmount[caller] != true){
            refundAmount[caller] = true;
            refundCount += 1; 
        }
        if (refundCount == 2){
            buyer.transfer(amount);
            fundsDisbursed = true;
        }

    }
}
