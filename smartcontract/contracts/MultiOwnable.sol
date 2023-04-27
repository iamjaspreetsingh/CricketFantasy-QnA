// SPDX-License-Identifier: MIT
import './EIP712MetaTxn.sol';

pragma solidity >=0.6.0 <0.8.0;


abstract contract MultiOwnable is EIP712MetaTxn("SportsDapp","1") {

    address public manager; // address used to set Admins
    address[] public Admins;
    mapping(address => bool) public AdminByAddress;

    event SetAdmins(address[] Admins);

    modifier onlyAdmin() {
        require(AdminByAddress[msgSender()] == true);
        _;
    }

    /**
     * @dev MultiOwnable constructor sets the manager
     */
        constructor(address _Admin) {
            require(_Admin != address(0), "Admin address cannot be 0");
            manager = _Admin;
        }
    
    /**
     * @dev Function to set Admins addresses
     */
    function setAdmins(address[] memory _Admins) public {
        require(msgSender() == manager);
        _setAdmins(_Admins);

    }

    function _setAdmins(address[] memory _Admins) internal {
        for(uint256 i = 0; i < Admins.length; i++) {
            AdminByAddress[Admins[i]] = false;
        }


        for(uint256 j = 0; j < _Admins.length; j++) {
            AdminByAddress[_Admins[j]] = true;
        }
        Admins = _Admins;
        emit SetAdmins(_Admins);
    }

    function getAdmins() public  view returns (address[] memory) {
        return Admins;
    }

   

    modifier onlyManager {
            _onlyManager();
            _;
        }

    function _onlyManager() private view {
        require(msgSender() == manager, "Only the contract manager may perform this action");
    }

}
