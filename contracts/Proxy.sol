// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/proxy/Proxy.sol";


library StorageSlot {
  struct AddressSlot {
    address value;
  }
  function getAddressSlot(bytes32 slot) internal pure returns (AddressSlot storage r) {
    assembly {
      r.slot := slot
    }
  }
}

contract VotingProxy is Proxy {
  using StorageSlot for bytes32;
  
  bytes32 private constant IMPL_SLOT = bytes32(uint(keccak256("eip1967.proxy.implementation")) - 1);
  bytes32 private constant ADMIN_SLOT =bytes32(uint(keccak256("eip1967.proxy.admin")) - 1);

  constructor() {
    _setAdmin(msg.sender);
  }

  // function _delegate(address _impl) internal virtual {
  //   assembly {
  //     calldatacopy(0, 0, calldatasize())
  //     let result := delegatecall(gas(), _impl, 0, calldatasize(), 0, 0)
  //     returndatacopy(0, 0, returndatasize())
  //     switch result
  //     case 0 {
  //       revert(0, returndatasize())
  //     }
  //     default {
  //       return(0, returndatasize())
  //     }
  //   }
  // }

  // function _fallback() private {
  //   _delegate(_getImpl());
  // }


  // fallback() external {
  //   _fallback();
  // }
  receive() external payable {
     _fallback();
  }

  function _implementation() internal view virtual override returns (address) {
    return _getImpl(); 
  }

  modifier ifAdmin() {
    if (msg.sender == _getAdmin()) {
      _;
    } else {
      _fallback();
    }
  }
  function upgradeTo(address _impl) external ifAdmin {
    _setImpl(_impl);
  }

  function _getImpl() private view  returns(address) {
    return IMPL_SLOT.getAddressSlot().value;
  }
  function _setImpl(address _impl) private {
    require(_impl.code.length > 0, "not a contract");
    IMPL_SLOT.getAddressSlot().value = _impl;
  }

  function _getAdmin() private view  returns(address) {
    return ADMIN_SLOT.getAddressSlot().value;
  }
  function _setAdmin(address _admin) private {
    require(_admin != address(0), "admin = 0 address");
    ADMIN_SLOT.getAddressSlot().value = _admin;
  }
  function impl() external ifAdmin returns (address) {
    return _getImpl();
  }
  function admin() external ifAdmin returns (address) {
    return _getAdmin();
  }
  
}