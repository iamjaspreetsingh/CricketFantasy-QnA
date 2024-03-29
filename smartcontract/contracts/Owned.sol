// SPDX-License-Identifier: MIT
import './EIP712MetaTxn.sol';

pragma solidity >=0.6.0 <0.8.0;

// https://docs.synthetix.io/contracts/Owned
abstract contract Owned is EIP712MetaTxn("SportsDapp","1") {
    address public owner;
    address public nominatedOwner;

    constructor(address _owner) {
        require(_owner != address(0), "Owner address cannot be 0");
        owner = _owner;
        emit OwnerChanged(address(0), _owner);
    }

    function nominateNewOwner(address _owner) external onlyOwner {
        nominatedOwner = _owner;
        emit OwnerNominated(_owner);
    }

    function acceptOwnership() external {
        require(msgSender() == nominatedOwner, "You must be nominated before you can accept ownership");
        emit OwnerChanged(owner, nominatedOwner);
        owner = nominatedOwner;
        nominatedOwner = address(0);
    }

    modifier onlyOwner {
        _onlyOwner();
        _;
    }

    function _notOnlyOwner() private view {
        require(msgSender() != owner, "Only the contract owner cannot perform this action");
    }

      modifier notOnlyOwner {
        _notOnlyOwner();
        _;
    }

    function _onlyOwner() private view {
        require(msgSender() == owner, "Only the contract owner may perform this action");
    }

    event OwnerNominated(address newOwner);
    event OwnerChanged(address oldOwner, address newOwner);
}
